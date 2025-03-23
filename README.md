## Controllers

- Toujours précédés du décorateur `@JsonController()` et `Authorized()`
- `JsonController('/path')` définit le chemin de base pour les routes du controller
- Vous pouvez ajouter un paramètre à Authorized pour réserver à un rôle, ex: `@Authorized('admin')`

## Méthodes de controllers

- `@Get()`, `@Post()`, `@Patch()`, `@Put()`, `@Delete()` pour les méthodes HTTP avec la route en paramètres
- Décorateurs de paramètres `@Param()`, `@Body()`, `@QueryParam()`,
- Décorateurs pour récupérer du contexte `@CurrentUser()`, `@Req()`, `@Res()`
- `@HttpCode()` pour définir le code de retour

## Documentation de route

- `@RequestBody(zodSchema)` pour le body, `@ResponseBody(httpCode, zodSchema)` pour la réponse,
  `@RequestParams(zodSchema)` pour les query params.

  ATTENTION: ce ne sont pas des validateurs, juste une info pour la doc
  OpenAPI !

## Tests end to end

- Tout se passe dans le dossier 'test'.
- Les fichiers doivent finir en `.test.ts`.
- Vous pouvez importer deux clients axios pré-authentifiés pour les tests : `adminClient` et `customerClient`.
- Pour run les tests en local, vous pouvez éxécuter `npm run prepare-test` puis `npm run test`. (Videz votre db entre
  deux suites de tests)