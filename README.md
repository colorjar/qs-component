# qs-component
React component for seamless query string state values.

## Motivation
One of the frequent tasks with creating Javascript apps is managing browser history for users.  A common approach is to keep the most relevant values in the query string; as we developed more and more pages with React, we found ourselves frequently mapping query string values to React component state values more or less directly, so we developed a component to do it.

`qs-component` creates a seamless data binding to a `state.qstate` object that transparently reflects the current query string value.

## Implementations
Currently we only offer support for [react-router](https://github.com/reactjs/react-router).  If you'd like to see your router supported, please let us know!

## Installation
    npm install qs-component

## Tests
You can run the test suite with the `npm run test` command.

## Usage
1. Extend the `QStateComponent` implementation for your router.
2. Opt-in to query string parameters by specifying them `getDefaultState()`.
3. Access query string values in `this.state.qstate` and modify them with `this.setQState()`.

That's it! It can be as simple as this: 
              
    class Example extends QStateComponent {
        getDefaultQuery() {
            return {
                page: 1
            };
        }
                    
        // this will return {page:1} until you change the QS page value in your browser
        // regardless of what else you put in the query string
        render() {
            return <div>
                {JSON.stringify(this.state.qstate)}
            </div>;
        }
    }
    

Query string values are strictly *opt-in*.  Other query string values will be silently ignored and your component will not get re-rendered for query string updates (unless your router remounts it).  To opt-in to a query string value, overload `getDefaultQuery()` with a map of keys to their query string default values.  Defaults will be removed from the query string transparently without creating a browser history entry, so users can't get caught in an infinite back-button-redirects-me-forever loop and we can cull noise like `page=1` from the query string.

    
### Implementing a router by extending QStateComponent
`class QStateComponent` provides three methods that must be overloaded to couple with a router.  The fourth abstract method, `getDefaultQuery()` is expected to be implemented by end users.

1. `getQuery()` - returns the current query string, or set of 'query' values you extract from your route.  The format should be {key: value}.  Currently only simple types are supported.
2. `replaceQuery(queryString)` - replace the current query string with the provided one.  The query string is expected to be replaced, not merged.  This should replace the most recent history entry, not create a new one.
3. `pushQuery(queryString)` - add a new history entry with the provided query string.  The user should be able to 'back' from this transition, but not `replaceQuery()`. 

A basic react-router implementation is as simple as this: 

    class Example extends QStateComponent {
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
    }

### React Lifecycle methods
`qs-component` by default only uses one lifecycle method: `componentWillMount()`, so if you need to use that method, please remember to call `super.componentWillMount()`.  If you need access to qstate, consider `componentDidMount()` instead.
    
#### React-Router implementation
The react-router implementation also overloads `componentWillReceiveProps()` (and provides a custom setQState) to take advantage of react-router lifecycle management to prevent excess render cycles.  
    

### Decoration API 
We understand that it's exceptionally greedy to expect the root node of your class hierarchy, so we also offer a decoration API.  The `decorate()` function is available as a named export and will monkey-patch itself onto your class.  Simply import it and wrap your parent class:
 
     import {decorate} from 'qs-compnent'; 
     // or:  import decorate from 'qs-component/es6/decorate';
     class Example extends decorate(React.Component) {
         //don't forget to overload me!
         getDefaultQuery() {
            return {
                page: 1
            };
         }
     }

## License

See [LICENSE](LICENSE).
