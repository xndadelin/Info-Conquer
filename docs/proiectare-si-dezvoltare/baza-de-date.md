---
description: MongoDB time!
---

# 🎋 Baza de date

🗄️ Ca bază de date am ales MongoDB, datorită structurii sale orientată pe documente, care îmi oferă flexibilitate. Serviciul destinat pentru a lucra cu datele din baza de date și a o hosta este MongoDB Atlas, un serviciu cloud integral.

#### `Announcement`

| Field      | Type   | Required | Unique | Description                          |
| ---------- | ------ | -------- | ------ | ------------------------------------ |
| title      | String | Yes      | Yes    | Title of the announcement            |
| content    | String | Yes      | No     | Content of the announcement          |
| createdBy  | String | Yes      | No     | User who created the announcement    |
| timestamps | Object | No       | No     | Created at and updated at timestamps |

#### `Article`

| Field      | Type   | Required | Unique | Description                            |
| ---------- | ------ | -------- | ------ | -------------------------------------- |
| title      | String | Yes      | Yes    | Title of the article                   |
| content    | String | Yes      | No     | Content of the article                 |
| creator    | String | Yes      | No     | Creator of the article                 |
| likes      | Array  | No       | No     | List of users who liked the article    |
| dislikes   | Array  | No       | No     | List of users who disliked the article |
| tags       | Array  | No       | No     | Tags associated with the article       |
| excerpt    | String | No       | No     | Short excerpt of the article           |
| timestamps | Object | No       | No     | Created at and updated at timestamps   |

#### `Contest`

| Field        | Type             | Required | Unique | Description                                                |
| ------------ | ---------------- | -------- | ------ | ---------------------------------------------------------- |
| name         | String           | Yes      | Yes    | Name of the contest                                        |
| description  | String           | No       | No     | Description of the contest                                 |
| startDate    | Date             | Yes      | No     | Start date of the contest                                  |
| endDate      | Date             | Yes      | No     | End date of the contest                                    |
| problems     | Array            | Yes      | No     | List of problems in the contest                            |
| languages    | \[String]        | Yes      | No     | List of languages allowed                                  |
| createdBy    | String           | Yes      | No     | User who created the contest                               |
| participants | Array of Objects | No       | No     | List of participants with their scores and problems solved |
| started      | Boolean          | No       | No     | Whether the contest has started                            |
| ended        | Boolean          | No       | No     | Whether the contest has ended                              |
| timestamps   | Object           | No       | No     | Created at and updated at timestamps                       |

#### `Daily`

| Field      | Type    | Required | Unique | Description                          |
| ---------- | ------- | -------- | ------ | ------------------------------------ |
| problem    | String  | Yes      | No     | Problem description                  |
| date       | Date    | Yes      | No     | Date of the problem                  |
| solvers    | Array   | No       | No     | List of solvers                      |
| ended      | Boolean | No       | No     | Whether the problem has ended        |
| timestamps | Object  | No       | No     | Created at and updated at timestamps |

#### `Problem`

| Field             | Type    | Required | Unique | Description                          |
| ----------------- | ------- | -------- | ------ | ------------------------------------ |
| creator           | String  | Yes      | No     | User who created the problem         |
| title             | String  | Yes      | Yes    | Title of the problem                 |
| description       | String  | No       | No     | Description of the problem           |
| requirements      | String  | Yes      | No     | Problem requirements                 |
| tags              | Array   | No       | No     | Tags associated with the problem     |
| category          | String  | Yes      | No     | Category of the problem              |
| subcategories     | Array   | Yes      | No     | Subcategories of the problem         |
| input             | String  | No       | No     | Input format for the problem         |
| output            | String  | No       | No     | Output format for the problem        |
| tests             | Array   | Yes      | No     | List of test cases                   |
| timeExecution     | Number  | Yes      | No     | Time limit for execution             |
| limitMemory       | Number  | Yes      | No     | Memory limit for execution           |
| examples          | Array   | No       | No     | Examples of input/output             |
| indications       | String  | No       | No     | Additional indications               |
| languages         | Array   | Yes      | No     | List of programming languages        |
| difficulty        | String  | Yes      | No     | Difficulty level                     |
| restriction       | String  | No       | No     | Any additional restrictions          |
| itsForContest     | Boolean | Yes      | No     | Whether the problem is for a contest |
| rejectedSolutions | Number  | No       | No     | Number of rejected solutions         |
| acceptedSolutions | Number  | No       | No     | Number of accepted solutions         |
| successRate       | Number  | No       | No     | Success rate percentage              |
| rating            | Number  | No       | No     | Rating of the problem                |
| ratings           | Array   | No       | No     | List of individual ratings           |
| timestamps        | Object  | No       | No     | Created at and updated at timestamps |

#### `Report`

| Field       | Type   | Required | Unique | Description                 |
| ----------- | ------ | -------- | ------ | --------------------------- |
| reporter    | String | Yes      | No     | User who reported the issue |
| title       | String | Yes      | No     | Title of the report         |
| description | String | Yes      | No     | Description of the issue    |
| type        | String | Yes      | No     | Type of the report          |
| problem     | String | No       | No     | Associated problem (if any) |

#### `User`

| Field                 | Type    | Required | Unique | Description                          |
| --------------------- | ------- | -------- | ------ | ------------------------------------ |
| username              | String  | Yes      | Yes    | Username of the user                 |
| email                 | String  | No       | Yes    | Email address of the user            |
| password              | String  | No       | No     | Password of the user                 |
| verified              | Boolean | No       | No     | Verification status of the user      |
| admin                 | Boolean | Yes      | No     | Whether the user is an admin         |
| solutions             | Array   | No       | No     | List of user solutions               |
| solvedProblems        | Array   | No       | No     | List of solved problems              |
| codeForVerification   | String  | No       | No     | Code used for email verification     |
| lastEmailVerification | Date    | No       | No     | Last email verification timestamp    |
| discordID             | String  | No       | No     | Discord ID of the user               |
| activity              | Array   | No       | No     | List of user activities              |
| profilePicture        | String  | No       | No     | URL of the profile picture           |
| bio                   | String  | No       | No     | Short biography of the user          |
| timestamps            | Object  | No       | No     | Created at and updated at timestamps |
