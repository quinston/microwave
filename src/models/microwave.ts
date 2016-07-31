import { HungryThing } from './hungryThing'

export interface Microwave {
	// in seconds
	timeLeft: number;
	line: Array<HungryThing>;
}
