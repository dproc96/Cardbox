const {assert} = require("chai");
const {User, Note, Category} = require("../models");
const {connect, disconnect} = require("../utils/database");

describe("Database", () => {
    beforeEach(connect);
    afterEach(disconnect);
    describe("Note", () => {
        describe("#title", () => {
            it("is a string", () => {
                const note = new Note({
                    title: "test",
                    html: "test"
                });
                assert.strictEqual(note.title, "test");
            })
        })
        describe("#color", () => {
            it("is a string", () => {
                const note = new Note({
                    title: "test",
                    html: "test",
                    color: "#000000"
                });
                assert.strictEqual(note.color, "#000000");
            })
            it("should equal #ffffff if no value is specified", () => {
                const note = new Note({
                    title: "test",
                    html: "test"
                });
                assert.strictEqual(note.color, "#ffffff")
            })
        })
        describe("#html", () => {
            it("is a string", () => {
                const note = new Note({
                    title: "test",
                    html: "test"
                });
                assert.strictEqual(note.html, "test");
            })
        })
        describe("#alterHtml", () => {
            it("changes the html", () => {
                const note = new Note({
                    title: "test",
                    html: "test"
                });
                note.alterHtml("new text");
                assert.strictEqual(note.html, "new text");
            })
        })
    })
})