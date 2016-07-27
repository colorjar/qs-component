import React from 'react';
import decorate from './decorate';
import PropTypes from 'react-router/lib/PropTypes';
const {locationShape, routerShape} = PropTypes;

export default function(component) {
    return class extends decorate(component) {
        static propTypes = {
            location: locationShape
        };

        static contextTypes = {
            router: routerShape
        };

        ___callbacks = [];

        setQState(newState, callback) {
            const qstate = this._extractQState(newState);

            this.pushQuery(this._cleanupQueryString(qstate));

            if(typeof callback === 'function') {
                this.___callbacks.push(callback);
            }
        }

        componentWillReceiveProps(props) {
            this.setState({qstate: props.location.query || {}}, () => {
                while(this.___callbacks.length) {
                    this.___callbacks.pop().call(this);
                }
            });
        }

        getQuery() {
            return typeof this.props.location.query ? this.props.location.query : {};
        }

        replaceQuery(query) {
            this.context.router.replace({
                ...this.props.location,
                query
            });
        }

        pushQuery(query) {
            this.context.router.push({
                ...this.props.location,
                query
            });
        }
    };
}
