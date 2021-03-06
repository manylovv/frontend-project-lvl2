import YAML from 'js-yaml';

export default (data, type) => {
  switch (type) {
    case 'json': {
      return JSON.parse(data, 'utf-8');
    }

    case 'yml':
    case 'yaml': {
      return YAML.load(data);
    }

    default: {
      throw new Error(`Cannot parse type: ${type}`);
    }
  }
};
