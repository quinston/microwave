import { Microwave, HungryThing, GameState } from '../models'
import * as clone from 'clone'

export class StateMachine {
	choices(gs: GameState): Array<number> {
		if (gs.line.length === 0) {
			return []
		}
		else {
			return [...gs.microwaves.keys()]
		}
	}

	makeChoice(gs: GameState, microwaveIndex: number): GameState {
		if (microwaveIndex in gs.microwaves) {
			const newGs: GameState = clone(gs)
			if (newGs.line.length > 0) {
				newGs.microwaves[microwaveIndex].line.push(newGs.line.shift())
				return newGs
			}
			else {
				throw new Error(`Cannot move to microwave index ${microwaveIndex} with nothing in ine in game state ${gs}`)
			}
		}
		else {
			throw new Error(`Invalid microwave index ${microwaveIndex} for game state ${gs}`)
		}
	}

	advanceTime(gs: GameState, time: number): GameState {
		if (time === Math.floor(time) && time >= 0) {
			const newGs: GameState = clone(gs)
			newGs.microwaves.forEach(m => {
				let timeToAdvance = time
				while (timeToAdvance >= m.timeLeft && m.line.length > 0) {
					timeToAdvance -= m.timeLeft
					m.timeLeft = m.line.shift().desiredMicrowaveTime
				}
				m.timeLeft = Math.max(0, m.timeLeft - timeToAdvance)
			})
			return newGs
		}
		else {
			throw new Error(`Time must be a nonnegative integer; got ${time}`)
		}
	}
}
