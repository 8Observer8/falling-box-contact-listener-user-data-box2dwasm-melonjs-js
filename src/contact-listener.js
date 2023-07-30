import { box2d } from "./init-box2d.js";

export default class ContactListener {
    constructor(metaData) {
        this.metaData = metaData;

        const {
            b2Contact,
            getPointer,
            JSContactListener,
            wrapPointer
        } = box2d;

        const self = this;
        this.instance = Object.assign(new JSContactListener(), {
            BeginContact(contact) {
                contact = wrapPointer(contact, b2Contact);
                const fixtureA = contact.GetFixtureA();
                const fixtureB = contact.GetFixtureB();
                const nameA = self.metaData[getPointer(fixtureA)].name;
                const nameB = self.metaData[getPointer(fixtureB)].name;
                console.log(`"${nameA}" <-> "${nameB}"`);
            },
            EndContact(contact) {},
            PreSolve(contact) {},
            PostSolve(contact) {}
        });
    }
}
