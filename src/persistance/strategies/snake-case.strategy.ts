import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class SnakeCaseStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  public columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    return snakeCase(embeddedPrefixes.join('_') + (customName || propertyName));
  }

  public tableName(
    targetName: string,
    userSpecifiedName: string | undefined,
  ): string {
    return userSpecifiedName || snakeCase(targetName);
  }

  public relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }
}
