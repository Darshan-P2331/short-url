const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const yup = require('yup')
const {nanoid} = require('nanoid')
const {GraphQLClient, gql, request} = require('graphql-request')

require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())

const graphQLClient = new GraphQLClient(process.env.HASURA_DB,{
    headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": process.env.ADMIN_SECRET
    }
})

app.get('/:id',async (req,res) => {
    try {
        const {id: slug} = req.params
        const query = gql`
        query GetUrl($slug: String) {
            compressUrl(where: {slug: {_eq: $slug}}) {
              slug
              url
            }
          }
        `
        const data = await graphQLClient.request(query,{slug})
        if (data.compressUrl) {
            const {url} = data.compressUrl[0]
            
            res.redirect(url)
        }
    } catch (err) {
        res.send(err)
    }
})

const schema = yup.object().shape({
    url: yup.string().trim().url().required()
})

app.post('/',async (req,res) => {
    try {
        const {url} = req.body;
        schema.validate({
            url
        })
        const slug = nanoid(5)

        const query = gql`
        mutation addUrl($slug: String,$url: String) {
            insert_compressUrl_one(object: {slug: $slug, url: $url}) {
              slug
              url
            }
          }
        `

        const data = await graphQLClient.request(query,{slug,url})
        const {slug: id} = data.insert_compressUrl_one
        res.send(process.env.CLIENT_URL+id)
    } catch (err) {
        res.send(err)
    }
})

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`LISTENING on http://localhost:5000`))