/// <reference path="../../../typings/index.d.ts" />

import * as mocha from 'mocha'
import { expect } from 'chai'

import { HungryThing, Microwave, GameState } from '../../models'
import { StateMachine } from '../../services'

describe('State machine', () => {
	it('should offer no choices', () => {
		const gs: GameState = {
			line: [],
			microwaves: [],
			makespan: 0
		}

		const sm = new StateMachine

		expect(sm.choices(gs)).to.eql([])
	})

	it('should offer only choice when there is one thing and one microwave', () => {
		const x: HungryThing = { name: 'Peace', desiredMicrowaveTime: 30 }
		const m: Microwave = { timeLeft: 0, line: [] }

		const gs: GameState = {
			line: [x],
			microwaves: [m],
			makespan: 0
		}

		const sm = new StateMachine

		expect(sm.choices(gs)).to.eql([0])
	})

	it('should offer no choices when nothing is in line', () => {
		const m: Microwave = { timeLeft: 0, line: [] }
		const gs: GameState = {
			line: [],
			microwaves: [m],
			makespan: 0
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
			microwaves: [m1, m2],
			makespan: 0
		}

		const sm = new StateMachine

		expect(sm.choices(gs).sort()).to.eql([0, 1])
	})

	it('should add thing to specified line', () => {
		const x: HungryThing = { name: 'A', desiredMicrowaveTime: 30 }
		const m: Microwave = { timeLeft: 10, line: [x] }
		const gs: GameState = {
			line: [x],
			microwaves: [m],
			makespan: 0
		}

		const sm = new StateMachine

		expect(sm.makeChoice(gs, 0)).to.eql({
			line: [],
			microwaves: [{
				timeLeft: 10,
				line: [x, x]
			}],
			makespan: 0
		})
	})

	it('should throw an error if specified microwave is invalid', () => {
		const x: HungryThing = { name: 'A', desiredMicrowaveTime: 30 }
		const m: Microwave = { timeLeft: 10, line: [x] }
		const gs: GameState = {
			line: [x],
			microwaves: [m],
			makespan: 0
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
			microwaves: [m, m2],
			makespan: 0
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
			}],
			makespan: 0
		})

		expect(sm.makeChoice(gs, 1)).to.eql({
			line: [],
			microwaves: [{
				timeLeft: 10,
				line: [x]
			}, {
				timeLeft: 11,
				line: [x, x]
			}],
			makespan: 0
		})
	})

	it('should throw error if a choice is made with nothing in line', () => {
		const m: Microwave = { timeLeft: 10, line: [] }
		const m2: Microwave = { timeLeft: 11, line: [] }
		const gs: GameState = {
			line: [],
			microwaves: [m, m2],
			makespan: 0
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
			microwaves: [m1, m2],
			makespan: 0
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
			}],
			makespan: 0
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
			}],
			makespan: 0
		})

		// one too many
		expect(() => [0, 0, 0, 0, 0, 0, 0, 0, 0]
	   .reduce((acc, x) => sm.makeChoice(acc, x), gs))
	   .to.throw(Error)
	})


	it('should advance recorded makespan', () => {
		const x1: HungryThing = { name: '', desiredMicrowaveTime: 10 }
		const m1: Microwave = { timeLeft: 5, line: [x1] }
		const gs: GameState = {
			line: [],
			microwaves: [m1],
			makespan: 10
		}
		const sm = new StateMachine

		expect(sm.advanceTime(gs, 2).makespan).to.eql(12)
	})

	it('should decrement microwave timer readout', () => {
		const m1: Microwave = { timeLeft: 20, line: [] }
		const gs: GameState = {
			line: [],
			microwaves: [m1],
			makespan: 0
		}
		const sm = new StateMachine

		expect(sm.advanceTime(gs, 1)).to.eql({
			line: [],
			microwaves: [{
				timeLeft: 19,
				line: []
			}],
			makespan: 1
		})

		expect(sm.advanceTime(gs, 13)).to.eql({
			line: [],
			microwaves: [{
				timeLeft: 7,
				line: []
			}],
			makespan: 13
		})
	})

	it('should not accept times that are not nonnegative integers', () => {
		const m1: Microwave = { timeLeft: 20, line: [] }
		const gs: GameState = {
			line: [],
			microwaves: [m1],
			makespan: 0
		}
		const sm = new StateMachine

		expect(() => sm.advanceTime(gs, 1.2)).to.throw(Error)
		expect(() => sm.advanceTime(gs, -1)).to.throw(Error)
		expect(() => sm.advanceTime(gs, 0)).to.not.throw(Error)
	})

	it('should advance time for more than one microwave', () => {
		const m1: Microwave = { timeLeft: 20, line: [] }
		const m2: Microwave = { timeLeft: 33, line: [] }
		const m3: Microwave = { timeLeft: 12, line: [] }

		expect((new StateMachine).advanceTime({
			line: [],
			microwaves: [m1, m2, m3],
			makespan: 0
		}, 9)).to.eql({
			line: [],
			microwaves: [{ timeLeft: 11, line: [] },
				{ timeLeft: 24, line: [] },
				{ timeLeft: 3, line: [] }],
			makespan: 9
		})
	})

	it('should advance line once microwave readout runs out', () => {
		const x1: HungryThing = { name: '', desiredMicrowaveTime: 57 }
		const m1: Microwave = { timeLeft: 3, line: [x1] }
		const gs: GameState = {
			line: [],
			microwaves: [m1],
			makespan: 0
		}
		const sm = new StateMachine

		expect(sm.advanceTime(gs, 3)).to.eql({
			line: [],
			microwaves: [{ timeLeft: 57, line: [] }],
			makespan: 3
		})

	})

	it('should advance line, reset microwave readout, and decrement microwave readout if time to advance is longer than microwave readout', () => {
		const x1: HungryThing = { name: '', desiredMicrowaveTime: 57 }
		const m1: Microwave = { timeLeft: 3, line: [x1] }
		const gs: GameState = {
			line: [],
			microwaves: [m1],
			makespan: 0
		}
		const sm = new StateMachine

		expect(sm.advanceTime(gs, 30)).to.eql({
			line: [],
			microwaves: [{ timeLeft: 30, line: [] }],
			makespan: 30
		})
	})

	it('should advance line multiple times when time elapses', () => {
		const x1: HungryThing = { name: '', desiredMicrowaveTime: 7 }
		const x2: HungryThing = { name: '', desiredMicrowaveTime: 3 }
		const m1: Microwave = { timeLeft: 6, line: [x1, x1, x2] }
		const gs: GameState = {
			line: [],
			microwaves: [m1],
			makespan: 0
		}
		const sm = new StateMachine

		expect(sm.advanceTime(gs, 21)).to.eql({
			line: [],
			microwaves: [{ timeLeft: 2, line: [] }],
			makespan: 21
		})
	})

	it('should advance the lines of multiple microwaves', () => {
		const x1: HungryThing = { name: '', desiredMicrowaveTime: 7 }
		const x2: HungryThing = { name: '', desiredMicrowaveTime: 3 }
		const m1: Microwave = { timeLeft: 6, line: [x1, x1, x2] }
		const m2: Microwave = { timeLeft: 2, line: [x2, x1] }
		const m3: Microwave = { timeLeft: 14, line: [x2, x1, x2, x2] }
		const gs: GameState = {
			line: [],
			microwaves: [m1, m2, m3],
			makespan: 0
		}
		const sm = new StateMachine

		expect(sm.advanceTime(gs, 21)).to.eql({
			line: [],
			microwaves: [
				{ timeLeft: 2, line: [] },
				{ timeLeft: 0, line: [] },
				{ timeLeft: 3, line: [x2, x2] }
			],
			makespan: 21
		})
	})
})
