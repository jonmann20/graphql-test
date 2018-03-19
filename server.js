'use strict';

const express = require('express');
const {graphqlExpress} = require('apollo-server-express');
const {graphiqlExpress} = require('apollo-server-express');
const {makeExecutableSchema} = require('graphql-tools');
const bodyParser = require('body-parser');
const server = express();

const users = [
	{
		name: 'Zackary Kelsolitonomo, Jr.',
		client: 'Demo',
		admitted_at: 'Jan 7, 2017 at 8:15am',
		surveyed_at: 'Jan 7, 2017 at 4:15am',
		mrn: '423489070',
		risk_score: 3
	},
	{
		name: 'Joe Kerry',
		client: 'Remedy Partners, LLC',
		admitted_at: 'Jan 7, 2017 at 9:15am',
		surveyed_at: 'Jan 7, 2017 at 1:15am',
		mrn: '13489370',
		risk_score: 2
	},
	{
		name: 'Billy Pharo',
		client: 'ProMedica',
		admitted_at: 'Jan 7, 2017 at 2:15am',
		surveyed_at: 'Jan 7, 2017 at 7:15am',
		mrn: '93488870',
		risk_score: 1
	},
	{
		name: 'Aaron Pharo',
		client: 'Beaumont',
		admitted_at: 'Jan 7, 2017 at 1:15am',
		surveyed_at: 'Jan 7, 2017 at 2:15am',
		mrn: '83488870',
		risk_score: 2
	},
	{
		name: 'Carla Pharo',
		client: 'Mammoth',
		admitted_at: 'Jan 7, 2017 at 2:15am',
		surveyed_at: 'Jan 7, 2017 at 9:15am',
		mrn: '73488870',
		risk_score: 1
	}
];

const schema = makeExecutableSchema({
	typeDefs: `
		# A user is used for authentication and identification
		type User {
			name: String!
			client: String!
			admitted_at: String!
			surveyed_at: String!
			mrn: String!

			# The RiskScore will be either Low, Medium, High, or n/a
			risk_score: String!

			hemoglobin: Int!
			@deprecated(reason: "Moved to PatientLabResult")
		}

		type Query {
			users: [User]
		}
	`,

	resolvers: {
		Query: {
			users: () => users
		},

		User: {
			risk_score(user) {
				switch(user.risk_score) {
					case 1: return 'Low';
					case 2: return 'Medium';
					case 3: return 'High';
					default: return 'n/a';
				}
			}
		}
	}
});

server.use('/graphql', bodyParser.json(), graphqlExpress({schema: schema}));
server.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

server.use(express.static(__dirname + '/'));
server.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

const port = process.env.PORT || 8080;
console.log(`using port ${port}`);
server.listen(port);