class Foo {
    async foo() {
        (await Promise.resolve());
    }
}
