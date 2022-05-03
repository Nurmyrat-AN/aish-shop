const DELETE_FUNCTION = ({ app, UTILS }) => {
    app.post('/delete/address/:id', async (req, res) => {
        try {
            const data = await UTILS.getRequestData(req)
            await UTILS.queryAsync(`DELETE FROM addresses WHERE id=${req.params.id} AND phone='${data.phone}'`)
            res.send(await UTILS.zip({ result: { status: 'OK', message: 'Saved Successfully' } }))
        } catch (e) {
            console.log(e)
            res.status(500).send('Something went wrong')
        }
    })
}

module.exports = DELETE_FUNCTION