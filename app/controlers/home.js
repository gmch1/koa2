class HomeCtl {
    index(ctx) {
        ctx.body = `<h1>index</h1>`
    }
}

module.exports = new HomeCtl()