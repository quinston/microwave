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
})
