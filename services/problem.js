import axios from 'axios';

const getList = (() => {
  let cachedData;
  return async (params, refetch = false) => {
    if (!cachedData || refetch) {
      const {data: {ticket_problems}} = await axios.get('ticket-problem/all', {params});
      cachedData = ticket_problems || [];
    }
    return cachedData;
  };
})();

const getOptions = async () => {
  const problems = await getList();
  return problems.map(problem => ({
    value: problem.problem_id,
    label: problem.name,
  }));
};

export default {
  getList,
  getOptions,
};