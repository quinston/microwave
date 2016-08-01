/// <reference path="../../../typings/index.d.ts" />

import * as mocha from 'mocha'
import { expect } from 'chai'

import { HungryThing, Microwave, GameState } from '../../models'
import { StateMachine } from '../../services'

describe('State machine', () => {
	it('should offer no choices', () => {
		const gs: GameState = {
			line: [],
			microwaves: []
		}

		const sm = new StateMachine

		expect(sm.choices(gs)).to.eql([])
	})

	it('should offer only choice when there is one thing and one microwave', () => {
		const x: HungryThing = { name: 'Peace', desiredMicrowaveTime: 30 }
		const m: Microwave = { timeLeft: 0, line: [] }

		const gs: GameState = {
			line: [x],
			microwaves: [m]
		}

		const sm = new StateMachine

		expect(sm.choices(gs)).to.eql([0])
	})

	it('should offer no choices when nothing is in line', () => {
		const m: Microwave = { timeLeft: 0, line: [] }
		const gs: GameState = {
			line: [],
			microwaves: [m]
		}

		const sm = new StateMachine

		expect(sm.choices(gs)).to.eql([])
	})

	it(`should offer all choices when there is something in line and there is more than one microwave`, () => {
		const x: HungryThing = { name: 'Peace', desiredMicrowaveTime: 30 }
		const m1: Microwave = { timeLeft: 0, line: [] }
		const m2: Microwave = { timeLeft: 0, line: [] }
		const gs: GameState = {
			line: [x],
			microwaves: [m1, m2]
		}

		const sm = new StateMachine

		expect(sm.choices(gs).sort()).to.eql([0, 1])
	})

	it('should add thing to specified line', () => {
		const x: HungryThing = { name: 'A', desiredMicrowaveTime: 30 }
		const m: Microwave = { timeLeft: 10, line: [x] }
		const gs: GameState = {
			line: [x],
			microwaves: [m]
		}

		const sm = new StateMachine

		expect(sm.makeChoice(gs, 0)).to.eql({
			line: [],
			microwaves: [{
				timeLeft: 10,
				line: [x, x]
			}]
		})
	})

	it('should throw an error if specified microwave is invalid', () => {
		const x: HungryThing = { name: 'A', desiredMicrowaveTime: 30 }
		const m: Microwave = { timeLeft: 10, line: [x] }
		const gs: GameState = {
			line: [x],
			microwaves: [m]
		}
		const sm = new StateMachine

		expect(() => sm.makeChoice(gs, 1)).to.throw(Error)
		expect(() => sm.makeChoice(gs, 2)).to.throw(Error)
	})

	it('should add thing to specified line when there is more than one microwave', () => {
		const x: HungryThing = { name: 'A', desiredMicrowaveTime: 30 }
		const m: Microwave = { timeLeft: 10, line: [x] }
		const m2: Microwave = { timeLeft: 11, line: [x] }
		const gs: GameState = {
			line: [x],
			microwaves: [m, m2]
		}

		const sm = new StateMachine

		expect(sm.makeChoice(gs, 0)).to.eql({
			line: [],
			microwaves: [{
				timeLeft: 10,
				line: [x, x]
			}, {
				timeLeft: 11,
				line: [x]
			}]
		})

		expect(sm.makeChoice(gs, 1)).to.eql({
			line: [],
			microwaves: [{
				timeLeft: 10,
				line: [x]
			}, {
				timeLeft: 11,
				line: [x, x]
			}]
		})
	})

	it('should throw error if a choice is made with nothing in line', () => {
		const m: Microwave = { timeLeft: 10, line: [] }
		const m2: Microwave = { timeLeft: 11, line: [] }
		const gs: GameState = {
			line: [],
			microwaves: [m, m2]
		}
		const sm = new StateMachine

		expect(() => sm.makeChoice(gs, 0)).to.throw(Error)
		expect(() => sm.makeChoice(gs, 1)).to.throw(Error)
	})

	it('should do many moves', () => {
		const x1: HungryThing = { name: 'One', desiredMicrowaveTime: 1 }
		const x2: HungryThing = { name: 'Two', desiredMicrowaveTime: 2 }
		const m1: Microwave = { timeLeft: 10, line: [x1, x1, x1, x2, x1] }
		const m2: Microwave = { timeLeft: 11, line: [x2, x1, x2] }
		const gs: GameState = {
			line: [x1, x2, x1, x2, x1, x2, x1, x2],
			microwaves: [m1, m2]
		}
		const sm = new StateMachine

		expect([0, 0, 0, 0, 0, 0, 0, 0].reduce((acc, x) => sm.makeChoice(acc, x), gs)).to.eql({
			line: [],
			microwaves: [{
				timeLeft: 10,
				line: [x1, x1, x1, x2, x1, x1, x2, x1, x2, x1, x2, x1, x2]
			},
			{
				timeLeft: 11,
				line: [x2, x1, x2]
			}]
		})

		expect([0, 1, 1, 0, 0, 1, 0].reduce((acc, x) => sm.makeChoice(acc, x), gs)).to.eql({
			line: [x2],
			microwaves: [{
				timeLeft: 10,
				line: [x1, x1, x1, x2, x1, x1, x2, x1, x1]
			},
			{
				timeLeft: 11,
				line: [x2, x1, x2, x2, x1, x2]
			}]
		})

		// one too many
		expect(() => [0, 0, 0, 0, 0, 0, 0, 0, 0]
	   .reduce((acc, x) => sm.makeChoice(acc, x), gs))
	   .to.throw(Error)
	})
})
