/* eslint-disable */
import should from 'should';
import React from 'react';
import QStateComponent from '../src/QStateComponent';
import {mount} from 'enzyme';
import sinon from 'sinon';
import jsdom from 'jsdom';

global.document = jsdom.jsdom('');
global.window = document.defaultView;

Object.keys(document.defaultView).forEach((property) => {
    if(typeof global[property] === 'undefined') {
        global[property] = document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'mocha'
};

if(typeof(documentRef) === 'undefined') {
    var documentRef;
}

documentRef = document;


class QStateComponentTestImpl extends QStateComponent {
}

const testQueryString = {
    bartlet: 'president',
    hoynes: 'vp',
    walken: 'speaker'
};
QStateComponentTestImpl.prototype.getQuery = sinon.stub().returns(testQueryString);

const defaultQueryValues = {
    bartlet: 'candidate',
    hoynes: 'scumbag',
    walken: 'cajun'
};
QStateComponentTestImpl.prototype.getDefaultQuery = sinon.stub().returns(defaultQueryValues);

QStateComponentTestImpl.prototype.pushQuery = sinon.stub();
QStateComponentTestImpl.prototype.replaceQuery = sinon.stub();
QStateComponentTestImpl.prototype.render = sinon.stub().returns(<div />);

let callCounts = {
    render: 0,
    push: 0,
    replace: 0
};

describe('QStateComponent tests', () => {
    // we mounted the component with a query string that isn't default
    // which means we should have had no effect on the query string
    // i.e. no push and no replace, and qstate should reflect
    // the mounted query string
    it('Tests default query extraction', () => {
        const component = mount(<QStateComponentTestImpl />).instance();
        component.render.callCount.should.eql(++callCounts.render);
        component.replaceQuery.callCount.should.eql(callCounts.replace);
        component.pushQuery.callCount.should.eql(callCounts.push);
        component.state.qstate.should.eql({
            bartlet: 'president',
            hoynes: 'vp',
            walken: 'speaker'
        });
    });

    // next, we want to make sure that qstate setting works as expected
    it('Tests setQstate with simple parameters', () => {
        const component = mount(<QStateComponentTestImpl />).instance();
        component.render.callCount.should.eql(++callCounts.render);
        component.setQState({bartlet: 'retired'});
        component.render.callCount.should.eql(++callCounts.render);
        component.pushQuery.lastCall.args[0].bartlet.should.eql('retired');
        component.state.qstate.bartlet.should.eql('retired');
        component.replaceQuery.callCount.should.eql(callCounts.replace);
        component.pushQuery.callCount.should.eql(++callCounts.push);
    });

    // so we can toggle non-default values, let's make sure defaults
    // are not pushed onto the history stack
    it('Tests setting a query back to default value', () => {
        const component = mount(<QStateComponentTestImpl />).instance();
        component.render.callCount.should.eql(++callCounts.render);
        component.setQState({bartlet: 'candidate'});
        should.not.exist(component.pushQuery.lastCall.args[0].bartlet);
        component.render.callCount.should.eql(++callCounts.render);
        component.replaceQuery.callCount.should.eql(callCounts.replace);
        component.pushQuery.callCount.should.eql(++callCounts.push)
    });
});