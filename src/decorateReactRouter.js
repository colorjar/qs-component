import React from 'react';
import decorate from './decorate';
import {locationShape, routerShape} from 'react-router/es6/PropTypes';

export default function(component) {
    return class extends decorate(component) {
        static propTypes = {
            location: locationShape
        };

        static contextTypes = {
            router: routerShape
        };

        setQState(newState, callback) {
            const qstate = {};

            if(typeof newState === 'function') {
                const prevState = Object.assign({}, this.state.qstate);
                Object.assign(qstate, this.getDefaultQuery(), this.state.qstate,
                    newState.call(this, prevState, this.props));
            } else {
                Object.assign(qstate, this.getDefaultQuery(), this.state.qstate, newState);
            }

            this.pushQuery(this._cleanupQueryString(qstate));

            if(typeof callback === 'function') {
                callback.call(this);
            }

        }

        componentWillReceiveProps() {
            this.setState({qstate: this.getQuery()});
        }

        getQuery() {
            return this.props.location.query;
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