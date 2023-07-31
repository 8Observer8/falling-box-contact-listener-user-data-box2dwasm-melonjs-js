import * as me from "melonjs";
import { box2d, initBox2D } from "./init-box2d.js";
import ContactListener from "./contact-listener.js";
import DebugDrawer from "./debug-drawer.js";

me.device.onReady(
    () => {
        if (!me.video.init(300, 300, {
                parent: "screen",
                renderer: me.video.AUTO,
                scale: "fit",
                antiAlias: true
            })) //
        {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        async function init() {
            await initBox2D();

            class Graphics extends me.Renderable {
                constructor() {
                    super(0, 0, me.game.viewport.width, me.game.viewport.height);
                    this.anchorPoint.set(0, 0);

                    const {
                        b2_dynamicBody,
                        b2BodyDef,
                        b2CircleShape,
                        b2PolygonShape,
                        b2Vec2,
                        b2World,
                        getPointer
                    } = box2d;

                    this.world = new b2World();
                    const gravity = new b2Vec2(0, 9.8);
                    this.world.SetGravity(gravity);
                    this.pixelsPerMeter = 30;

                    this.debugDrawer = new DebugDrawer(me.game.renderer, this.pixelsPerMeter);
                    this.world.SetDebugDraw(this.debugDrawer.instance);

                    const metaData = {};

                    // Ground
                    const groundBodyDef = new b2BodyDef();
                    groundBodyDef.set_position(new b2Vec2(150 / this.pixelsPerMeter, 285 / this.pixelsPerMeter));
                    const groundBody = this.world.CreateBody(groundBodyDef);
                    const groundShape = new b2PolygonShape();
                    groundShape.SetAsBox(270 / 2 / this.pixelsPerMeter, 15 / 2 / this.pixelsPerMeter);
                    const groundFixture = groundBody.CreateFixture(groundShape, 0);
                    metaData[getPointer(groundFixture)] = {
                        name: "ground"
                    };

                    // Box
                    const boxBodyDef = new b2BodyDef();
                    boxBodyDef.set_position(new b2Vec2(150 / this.pixelsPerMeter, 0 / this.pixelsPerMeter));
                    boxBodyDef.angle = -20 * Math.PI / 180;
                    boxBodyDef.type = b2_dynamicBody;
                    const boxBody = this.world.CreateBody(boxBodyDef);
                    const boxShape = new b2PolygonShape();
                    boxShape.SetAsBox(60 / 2 / this.pixelsPerMeter, 60 / 2 / this.pixelsPerMeter);
                    const boxFixture = boxBody.CreateFixture(boxShape, 1);
                    metaData[getPointer(boxFixture)] = {
                        name: "box"
                    };

                    // Circle
                    const circleBodyDef = new b2BodyDef();
                    circleBodyDef.position = new b2Vec2(50 / this.pixelsPerMeter, 230 / this.pixelsPerMeter);
                    const circleRigidBody = this.world.CreateBody(circleBodyDef);
                    const circleShape = new b2CircleShape();
                    circleShape.m_radius = 20 / this.pixelsPerMeter;
                    const circleFixture = circleRigidBody.CreateFixture(circleShape, 0);
                    metaData[getPointer(circleFixture)] = {
                        name: "circle"
                    };

                    // Platform
                    const platformBodyDef = new b2BodyDef();
                    platformBodyDef.set_position(new b2Vec2(225 / this.pixelsPerMeter,
                        195 / this.pixelsPerMeter));
                    platformBodyDef.angle = 0 * Math.PI / 180;
                    const platformBody = this.world.CreateBody(platformBodyDef);
                    const platformShape = new b2PolygonShape();
                    platformShape.SetAsBox(120 / 2 / this.pixelsPerMeter, 15 / 2 / this.pixelsPerMeter);
                    const platformFixture = platformBody.CreateFixture(platformShape, 0);
                    metaData[getPointer(platformFixture)] = {
                        name: "platform"
                    };

                    const contactListener = new ContactListener(metaData);
                    this.world.SetContactListener(contactListener.instance);
                }

                update(dt) {
                    this.world.Step(dt / 1000, 3, 2);
                    return true;
                }

                draw(renderer) {
                    renderer.clearColor("#000000");
                    renderer.setGlobalAlpha(1);
                    this.world.DebugDraw();
                }
            }

            me.game.world.addChild(new Graphics());
        }
        init();
    });
