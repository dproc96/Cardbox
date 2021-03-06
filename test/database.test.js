const {assert} = require("chai");
const {User, Note, Category} = require("../models");
const {connect, disconnect} = require("../utils/database");
const bcrypt = require("bcryptjs")

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
        describe("#attachToUser", () => {
            it("attaches a User document to the Note document", async () => {
                const user = new User({
                    email: "test@test.com",
                    password: "test",
                    username: "test"
                })
                await user.save()
                const note = new Note({
                    title: "test",
                    html: "test"
                });
                await note.save()
                await note.attachToUser(user._id);
                assert.include(note, { author: user._id })
            })
            it("attaches a Note document to the User document", async () => {
                const user = new User({
                    email: "test@test.com",
                    password: "test",
                    username: "test"
                })
                await user.save()
                const note = new Note({
                    title: "test",
                    html: "test"
                });
                await note.save()
                await note.attachToUser(user._id);
                const dbUser = await User.findOne({ _id: user._id })
                assert.include(dbUser.notes, note._id);
            })
            it("attaches a Note document to the User document automatically if Note is saved with an author", async () => {
                const user = new User({
                    email: "test@test.com",
                    password: "test",
                    username: "test"
                })
                await user.save()
                const note = new Note({
                    title: "test",
                    html: "test",
                    author: user._id
                });
                await note.save()
                const dbUser = await User.findOne({ _id: user._id })
                assert.include(dbUser.notes, note._id);
            })
            it("throws an error if the user doesn't exist", async () => {
                const user = new User({
                    email: "test@test.com",
                    password: "test",
                    username: "test"
                })
                const note = new Note({
                    title: "test",
                    html: "test"
                });
                await note.save()
                try {
                    await note.attachToUser(user._id);
                }
                catch (error) {
                    assert.strictEqual(error.message, "User not found")
                }
            })
        })
        describe("#attachCategory", () => {
            it("attaches a Category document to the Note document", async () => {
                const note = new Note({
                    title: "test",
                    html: "test"
                });
                await note.save();
                const category = new Category({
                    name: "test"
                });
                await category.save();
                await note.attachCategory(category._id);
                assert.include(note.categories, category._id);
            })
            it("attaches the Note document to the Category document", async () => {
                const note = new Note({
                    title: "test",
                    html: "test"
                });
                await note.save();
                const category = new Category({
                    name: "test"
                });
                await category.save();
                await note.attachCategory(category._id);
                const dbCategory = await Category.findOne({ _id: category._id });
                assert.include(dbCategory.notes, note._id)
            })
        })
    })
    describe("User", () => {
        describe("#email", () => {
            it("is a string", () => {
                const user = new User({
                    email: "test@test.com"
                })
                assert.strictEqual(user.email, "test@test.com")
            })
            it("should be invalid with an invalid email", () => {
                const user = new User({
                    email: "test",
                    password: "test",
                    username: "test"
                })
                user.validateSync();
                assert.ok(user.errors, "model should be invalid");
                assert.equal(user.errors.email.message, "email field must be an email");
            })
            it("should be valid with an valid email", () => {
                const user = new User({
                    email: "test@test.com",
                    password: "test",
                    username: "test"
                })
                user.validateSync();
                assert.isUndefined(user.errors, "model should be valid");
            })
            it("must be unique", async () => {
                const user = new User({
                    email: "test@test.com",
                    password: "test",
                    username: "test"
                });
                await user.save();
                const userDuplicate = new User({
                    email: "test@test.com",
                    password: "test",
                    username: "test2"
                });
                userDuplicate.save(error => {
                    assert.ok(error)
                    assert.equal(error.errors.email.message, "Error, expected `email` to be unique. Value: `test@test.com`");
                })
            })
        })
        describe("#password", () => {
            it("is a string", () => {
                const user = new User({
                    password: "test"
                })
                assert.strictEqual(user.password, "test")
            })
            it("is hashed on save", async () => {
                const password = "test"
                const user = new User({
                    email: "test@test.com",
                    password: password,
                    username: "test"
                });
                await user.save();
                const isHashed = bcrypt.compareSync(password, user.password);
                assert.ok(isHashed)
            })
        })
        describe("#username", () => {
            it("is a string", () => {
                const user = new User({
                    username: "test"
                })
                assert.strictEqual(user.username, "test")
            })
            it("must be unique", async () => {
                const user = new User({
                    email: "test@test.com",
                    password: "test",
                    username: "test"
                });
                await user.save();
                const userDuplicate = new User({
                    email: "test2@test.com",
                    password: "test",
                    username: "test"
                });
                userDuplicate.save(error => {
                    assert.ok(error)
                    assert.equal(error.errors.username.message, "Error, expected `username` to be unique. Value: `test`");
                })
            })
        })
        describe("#generateAuthToken", () => {
            it("generates a token", async () => {
                const user = new User({
                    email: "test@test.com",
                    password: "test",
                    username: "test"
                });
                await user.save();
                const token = await user.generateAuthToken();
                assert.isString(token);
            })
            it("saves the token to the db", async () => {
                const user = new User({
                    email: "test@test.com",
                    password: "test",
                    username: "test"
                });
                await user.save();
                const token = await user.generateAuthToken();
                assert.strictEqual(user.tokens[0].token, token)
            })
        })
        describe(".logIn", () => {
            it("returns a token if successful", async () => {
                const email = "test@test.com";
                const password = "test";
                const user = new User({
                    email: email,
                    password: password,
                    username: "test"
                });
                await user.save();
                const token = await User.logIn(email, password);
                assert.isString(token);
            })
            it("throws an error if email doesn't match", async () => {
                const email = "test@test.com";
                const password = "test";
                const user = new User({
                    email: email,
                    password: password,
                    username: "test"
                });
                await user.save();
                try {
                    const token = await User.logIn("test@tes.com", password);
                }
                catch (error) {
                    assert.strictEqual(error.message, "No user found")
                }
            })
            it("throws an error if password doesn't match", async () => {
                const email = "test@test.com";
                const password = "test";
                const user = new User({
                    email: email,
                    password: password,
                    username: "test"
                });
                await user.save();
                try {
                    const token = await User.logIn(email, "tes");
                }
                catch (error) {
                    assert.strictEqual(error.message, "Password does not match")
                }
            })
        })
    })
    describe("Category", () => {
        describe("#name", () => {
            it("is a string", () => {
                const category = new Category({
                    name: "test"
                });
                assert.strictEqual(category.name, "test")
            })
        })
    })
})