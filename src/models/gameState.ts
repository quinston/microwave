import { HungryThing } from './hungryThing'
import { Microwave } from './microwave'

export interface GameState {
	// hungry things that have yet to join any specific microwave's line
	line: Array<HungryThing>;
	microwaves: Array<Microwave>;
	makespan: number;
}
