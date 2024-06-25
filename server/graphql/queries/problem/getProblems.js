const Problem = require('../../../models/problem')
module.exports = {
    async getProblems(_, {category, subcategory}) {
        const query = {};
        if (category) {
            query.category = category;
        }
        if (subcategory !== 'none') {
            query.subcategories = { $in: [subcategory] };
        }
        const problems = await Problem.find(query, {itsForContest: false}).select('title category subcategories difficulty tags type');
        return problems;
    }
}