import React from 'react';

export default function(component) {
    return class extends component {
        /*
         * This needs to be overloaded to return an object
         * representing the current query string, e.g.
         * /page?foo=bar&page=1 should return
         * {foo: bar, page: 1}
         */
        getQuery() {
            throw new Error('This needs to be overloaded');
        }

        /*
         * This needs to be overloaded to take a query object
         * and replace the current query string with it.
         *
         * In this context, replace means replace the last entry
         * in history, not add a new one.
         *
         * This is used for deleting default query parameters from the
         * query string, so if a user is linked to /foo?page=1 they are
         * replaced to /foo.  The user should not be able to get back
         * to the page=1 query string with their back button.
         */
        replaceQuery() { // eslint-disable-line react/sort-comp
            throw new Error('This needs to be overloaded');
        }

        /*
         * This needs to be overloaded to take a query object
         * and push it onto the history stack.
         */
        pushQuery() {
            throw new Error('This needs to be overloaded');
        }

        /*
         * Child classes need to implement this to provide the default
         * state values for variables from the query string.  This
         * values will always be available, whether the query string is
         * specified or not.
         *
         * These values get maintained in this.state.qstate
         */
        getDefaultQuery() {
            throw new Error('This needs to be overloaded');
        }

        componentWillMount() {
            const defaults = this.getDefaultQuery();
            const query = this.getQuery();

            this.setState({qstate: Object.assign({}, defaults, query)}, () => {
                if(Object.keys(query).filter(k => defaults[k] === query[k]).length > 0) {
                    this.replaceQuery(this._cleanupQueryString(this.state.qstate));
                }
            });

            if(super.hasOwnProperty('componentWillMount')) {
                super.componentWillMount.call(this);
            }
        }

        setQState(newState, callback) {
            const qstate = this._extractQState(newState);

            const _callback = () => {
                this.pushQuery(this._cleanupQueryString(qstate));

                if(typeof callback === 'function') {
                    callback.call(this);
                }
            };

            this.setState({qstate}, _callback);
        }

        _extractQState(newState) {
            const qstate = {};

            if(typeof newState === 'function') {
                const prevState = Object.assign({}, this.state.qstate);
                Object.assign(qstate, this.getDefaultQuery(), this.state.qstate,
                    newState.call(this, prevState, this.props));
            } else {
                Object.assign(qstate, this.getDefaultQuery(), this.state.qstate, newState);
            }
        }

        _cleanupQueryString(query) {
            const defaults = this.getDefaultQuery();
            Object.keys(query).filter(key => query[key] === defaults[key]).forEach(key => delete query[key]);
            return query;
        }
    };
}