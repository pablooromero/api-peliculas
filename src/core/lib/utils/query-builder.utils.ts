import { SelectQueryBuilder } from "typeorm";

export function queryBuilderCriteria<T>(
  queryBuilder: SelectQueryBuilder<T>,
  q: string,
  relations: string[] = []
) {
  const criteria = decodeFilterCriteriaList(q);

  // Mapa de relaciones, mapea las propiedades a los alias de las relaciones
  const relationMap = {
    categoryIds: 'c.categories',
    filmIds: 'c.films',
  };

  const joinedRelations = new Set<string>();

  if (criteria.filters && criteria.filters.length > 0) {
    criteria.filters.forEach(filter => {
      const value = filter.value;
      let property = filter.property;

      if (relationMap[property] && value) {
        const relation = relationMap[property];
        const alias = relation.split('.').pop();

        if (!joinedRelations.has(alias)) {
          queryBuilder.leftJoinAndSelect(relation, alias);
          joinedRelations.add(alias);
        }

        queryBuilder.andWhere(`${alias}.id IN (:...${alias}Ids)`, {
          [`${alias}Ids`]: value.split(','),
        });
      } else if (property && value) {
        queryBuilder.andWhere(`c.${toSnakeCase(property)} IN (:...${property}Ids)`, {
          [`${property}Ids`]: value.split(','),
        });
      }
    });
  }

  relations.forEach(relation => {
    const alias = relation.split('.').pop();
    if (!joinedRelations.has(alias)) {
      queryBuilder.leftJoinAndSelect(relation, alias);
      joinedRelations.add(alias);
    }
  });

  return queryBuilder;
}


export const decodeFilterCriteriaList = (q: string) => {
  if (!q) {
    return {
      page: 1,
      limit: 10,
      filters: []
    };
  }

  const bufferObj = Buffer.from(q, "base64");
  const decodedString = bufferObj.toString("utf8");

  const criteria = JSON.parse(decodedString);
  criteria.page = criteria.page ?? 1;
  criteria.limit = criteria.limit ?? 10;

  return criteria;
};

function toSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}
