import { map, mapValues, reduce } from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";

function NO_OP() {}

function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export interface HTMLElementEventHandlers {
  [eventName: string]: Function;
}

export interface HTMLElementPropConverters {
  [propName: string]: (attribute: string) => any;
}

function createReactWebComponent(
  Component: typeof React.Component,
  attributeTransformers: HTMLElementPropConverters,
  eventHandlers: HTMLElementEventHandlers
) {
  return class ReactWebComponent extends HTMLElement {
    private _eventHandlers: HTMLElementEventHandlers;
    private _preventRener: boolean;

    addEventListener(
      name: string,
      callback: (event: Event) => any
    ): void {
      const eventName = `on${capitalise(name)}`;
      if (
        process.env.NODE_ENV !== "production" &&
        this._eventHandlers[eventName]
      ) {
        console.warn(
          "You cannot add multiple event handlers for react callbacks"
        );
      }

      this._preventRener = true;
      this._eventHandlers[eventName] = (...args) => {
        if (eventHandlers[eventName]) {
          eventHandlers[eventName].call(this, args);
        }

        return;
      };
      this._preventRener = false;

      return super.addEventListener(name, callback);
    }

    removeEventListener(
      name: string,
      eventListener: EventListener | EventListenerObject | undefined
    ) {
      const eventName = `on${capitalise(name)}`;
      this._eventHandlers[eventName] = eventHandlers[eventName].bind(this) || NO_OP;

      return super.removeEventListener(name, eventListener);
    }

    detachedCallback(): void {
      ReactDOM.unmountComponentAtNode(this);
    }

    attachedCallback() {
      this._eventHandlers = mapValues(eventHandlers, (cb) => {
        return cb.bind(this)
      });
      this._preventRener = false;
      this.render();
    }

    attributeChangedCallback(
      _name: string,
      oldValue: string,
      newValue: string
    ) {
      if (oldValue !== newValue) {
        this.render();
      }
    }

    render(): void {
      if (!this._preventRener) {
        const props = reduce(
          this.attributes,
          (acc, attribute) => {
            const name = attribute.name;
            acc[name] = attributeTransformers[name]
              ? attributeTransformers[name](attribute.value)
              : attribute.value;
            return acc;
          },
          this._eventHandlers
        );

        ReactDOM.render(<Component {...props} />, this);
      }
    }
  };
}

export default function(
  attributeTransformers: HTMLElementPropConverters,
  eventHandlers: HTMLElementEventHandlers
) {
  return function(Component: typeof React.Component) {
    return createReactWebComponent(
      Component,
      attributeTransformers,
      eventHandlers
    );
  };
}
