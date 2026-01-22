# Plan Maestro de Refactorización - ActivaGas

## Resumen Ejecutivo

Este plan de refactorización fue generado por 3 agentes especializados que analizaron exhaustivamente el código fuente de la aplicación ActivaGas. El plan está organizado en 3 áreas principales:

1. **Arquitectura y Mejores Prácticas**
2. **Seguridad**
3. **Rendimiento y Calidad de Código**

---

## Estadísticas del Análisis

| Métrica | Valor |
|---------|-------|
| Ocurrencias de `any` | 500+ |
| Directivas `eslint-disable` | 59 |
| Archivos de test | 1 |
| Cobertura de tests | ~0% |
| Usos de `useCallback` | 8 |
| Usos de `useMemo` | 0 |
| Estilos inline | 704 |
| Slices de Redux | 19 |

---

# PARTE 1: ARQUITECTURA Y MEJORES PRÁCTICAS

## 1.1 Estructura del Proyecto

**Problemas:**
- Inconsistencia en nomenclatura (PascalCase vs camelCase)
- Estructura por tipo de archivo en lugar de features
- Estilos inline dispersos

**Propuesta:**
```
src/
  features/
    auth/
      components/
      hooks/
      services/
      screens/
      types/
    client/
    activation/
    accounting/
    maintenance/
    stock/
  shared/
    components/
    hooks/
    utils/
    styles/
  core/
    config/
    redux/
    navigation/
```

**Prioridad:** ALTA

---

## 1.2 Gestión de Estado (Redux + React Query)

**Problemas:**
- Slices duplicados con funcionalidad idéntica
- Solapamiento entre Redux y React Query
- Nombres de acciones no descriptivos

**Propuesta:**
- Consolidar slices duplicados
- Redux: estado UI/cliente
- React Query: estado del servidor
- Renombrar acciones: `user/setLoggedUser`, `session/activate`

**Archivos críticos:**
- `src/redux/states/*.ts` (17 archivos)
- `src/redux/store.ts`
- `src/redux/reducers/rootReducer.ts`

**Prioridad:** ALTA

---

## 1.3 Capa de Servicios GraphQL

**Problemas:**
- Dos clientes GraphQL duplicados
- Hooks de mutation duplicados (80+ líneas repetidas)
- Falta de tipado en queries

**Propuesta:**
- Cliente GraphQL unificado
- Generación de tipos con graphql-codegen
- Hooks base genéricos con tipado

**Prioridad:** ALTA

---

## 1.4 Componentización

**Problemas:**
- Componentes con múltiples responsabilidades
- Gradientes lineales duplicados en casi todas las pantallas
- Props drilling excesivo

**Propuesta:**
- Biblioteca de componentes atómicos (`GradientBackground`, `BaseCard`, `FormInput`)
- StyleSheet centralizado con tema
- Context para props comunes

**Prioridad:** MEDIA

---

## 1.5 Hooks Personalizados

**Problemas:**
- `useDataLayer` tiene 187 líneas con múltiples responsabilidades
- useEffect sin cleanup adecuado

**Propuesta:**
- Dividir `useDataLayer` en: `useHCESession`, `useNFCTag`, `useHCELogger`
- Implementar cleanup correcto en todos los useEffect
- Crear hook `useAuth`

**Prioridad:** MEDIA

---

## 1.6 Navegación Basada en Roles

**Problemas:**
- `RouterValidation` es monolítico (272 líneas)
- IDs de roles hardcodeados con comparaciones `==`
- Falta de lazy loading

**Propuesta:**
- Crear AuthProvider con Context
- Implementar Route Guards como HOC
- Usar React.lazy para carga diferida

**Prioridad:** ALTA

---

## 1.7 Sistema de Formularios Dinámicos

**Problemas:**
- Solo 3 validaciones soportadas (required, minLength, maxLength)
- `DynamicInputBasic` con 220 líneas mezcladas

**Propuesta:**
- Extender validaciones: email, phone, pattern, custom
- Separar componentes de input

**Prioridad:** MEDIA

---

# PARTE 2: SEGURIDAD

## 2.1 Almacenamiento Inseguro de Datos (CRÍTICO)

**Vulnerabilidad:** Tokens JWT almacenados en AsyncStorage sin encriptación

**Archivos afectados:**
- `src/services/Login/Login.ts`
- `src/services/Login/RefreshToken.ts`
- `src/utils/routerValidation.tsx`

**Solución:**
- Implementar `react-native-keychain` (iOS Keychain, Android Keystore)
- Alternativa: `react-native-encrypted-storage` (AES-256)

**Riesgo:** CRÍTICO

---

## 2.2 Autenticación Insegura (ALTO)

**Vulnerabilidades:**
1. Token JWT decodificado sin validar firma
2. Lógica de roles basada en IDs hardcodeados
3. Sin protección contra fuerza bruta

**Soluciones:**
- Nunca confiar en datos del JWT en cliente
- Validación de roles exclusivamente en servidor
- Rate limiting + CAPTCHA

**Riesgo:** ALTO

---

## 2.3 Comunicación Insegura (ALTO)

**Vulnerabilidades:**
1. Sin certificate pinning
2. Endpoint de staging expuesto

**Soluciones:**
- Implementar `react-native-ssl-pinning`
- Variables de entorno para endpoints

**Riesgo:** ALTO

---

## 2.4 Seguridad NFC/HCE (ALTO)

**Vulnerabilidad:** Datos NFC transmitidos como texto plano JSON

**Archivos afectados:**
- `src/Screens/ScreensActivator/WriteNfcScreen/WriteNfcScreen.tsx`
- `src/hooks/useDataLayer.ts`

**Solución:**
- Encriptación AES-128/256 para datos NFC
- Claves de sesión únicas
- Autenticación mutua entre dispositivos

**Riesgo:** ALTO

---

## 2.5 Validación de Entrada Insuficiente (MEDIO)

**Problemas:**
- Solo validaciones básicas (required, minLength, maxLength)
- Contraseña sin requisitos de complejidad

**Solución:**
- Agregar validaciones: email, phone, pattern, sanitización
- Requisitos de contraseña: mayúsculas, minúsculas, números, especiales

---

## 2.6 Exposición de Información Sensible (MEDIO)

**Problemas:**
- `console.log` expone datos sensibles (keys, estado de sesión)
- Mensajes de error revelan arquitectura ("Mongo")

**Solución:**
- Eliminar console.log en producción
- Usar `babel-plugin-transform-remove-console`
- Mapear errores a mensajes genéricos

---

## 2.7 Otras Recomendaciones

- Root/Jailbreak Detection
- Detección de Debugging/Tampering
- Timeout de sesión por inactividad

---

# PARTE 3: RENDIMIENTO Y CALIDAD DE CÓDIGO

## 3.1 Renderizado - ScrollView vs FlatList (CRÍTICO)

**Problema:** `UsersFlatList.tsx` usa ScrollView con `.map()` renderizando TODOS los items

**Solución:**
```typescript
<FlatList
  data={data}
  renderItem={renderItem}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={5}
  removeClippedSubviews={true}
/>
```

**Mejora esperada:** 70% menos memoria, 80% más rápido

---

## 3.2 Selectores de Redux No Optimizados (ALTO)

**Problema:** 120+ usos de `useSelector` sin memoización

**Solución:**
```typescript
export const selectServices = createSelector(
  [(state: IStore) => state.services],
  (services) => services
);
```

**Mejora esperada:** 40-60% menos re-renders

---

## 3.3 Carga de Imágenes Sin Cache (ALTO)

**Problema:** Imágenes sin cache ni lazy loading

**Solución:**
- Implementar `react-native-fast-image`
- Precargar imágenes críticas

**Mejora esperada:** 80% menos tráfico, 90% más rápido

---

## 3.4 Lazy Loading de Screens (ALTO)

**Problema:** 0 usos de React.lazy/Suspense

**Solución:**
```typescript
const ScannerScreen = React.lazy(() =>
  import('../Screens/ScreensActivator/ScannerScreen/ScannerScreen')
);
```

**Mejora esperada:** 30-40% menos tiempo de inicio

---

## 3.5 Memory Leaks (ALTO)

**Problema:** Event listeners y intervalos sin cleanup

**Archivos afectados:**
- `src/routes/RoutesAuth.tsx`
- `src/routes/RoutesClient.tsx`
- `src/utils/routerValidation.tsx`

**Solución:**
```typescript
useEffect(() => {
  const subscription = AppState.addEventListener('change', handler);
  return () => subscription.remove();
}, []);
```

---

## 3.6 TypeScript - 500+ usos de `any` (ALTO)

**Solución:**
- Crear tipos para queries GraphQL
- Usar genéricos en hooks
- Configurar `strict: true` en tsconfig

---

## 3.7 Código Duplicado (MEDIO)

**Problema:** 6 componentes ImageContainer casi idénticos

**Solución:** Componente genérico `MediaCapture`

**Mejora:** ~500 líneas eliminadas

---

## 3.8 Tests (CRÍTICO)

**Estado actual:** 1 archivo de test, ~0% cobertura

**Objetivo:** >70% cobertura
- Tests unitarios para Redux slices
- Tests de hooks personalizados
- Tests de componentes críticos

---

## 3.9 ESLint (MEDIO)

**Problema:** 59 ocurrencias de `eslint-disable`

**Solución:**
- Configurar ESLint estrictamente
- Pre-commit hooks
- Resolver warnings en lugar de ignorarlos

---

# ARCHIVOS CRÍTICOS PARA LA REFACTORIZACIÓN

| Archivo | Razón |
|---------|-------|
| `src/utils/routerValidation.tsx` | Monolítico, autenticación, tokens, memory leaks |
| `src/redux/store.ts` | Centro de Redux, necesita tipado y selectores |
| `src/hooks/useGraphQlMutation.ts` | Duplicado, necesita unificarse con tipado |
| `src/services/Login/Login.ts` | Almacenamiento inseguro de tokens |
| `src/config/graphQlClient.ts` | Duplicado, sin certificate pinning |
| `src/Components/UsersFlatList/UsersFlatList.tsx` | ScrollView en lugar de FlatList |
| `src/Components/DynamicForms/DynamicForm.tsx` | Validaciones limitadas |
| `src/hooks/useDataLayer.ts` | 187 líneas, encriptación NFC |

---

# FASES DE IMPLEMENTACIÓN SUGERIDAS

## Fase 1: Fundamentos Críticos
- [ ] Almacenamiento seguro de tokens
- [ ] Reemplazar ScrollView por FlatList
- [ ] Cleanup de event listeners/intervalos
- [ ] Certificate pinning

## Fase 2: Arquitectura de Estado
- [ ] Tipado estricto de Redux
- [ ] Selectores memoizados
- [ ] Unificar clientes GraphQL
- [ ] AuthProvider con Context

## Fase 3: Seguridad NFC
- [ ] Encriptación AES para datos NFC
- [ ] Validación de datos mejorada

## Fase 4: Rendimiento
- [ ] Cache de imágenes (FastImage)
- [ ] Lazy loading de screens
- [ ] Eliminar código duplicado

## Fase 5: Calidad
- [ ] Eliminar todos los `any`
- [ ] Tests unitarios >70%
- [ ] ESLint estricto
- [ ] Reorganizar estructura de carpetas

---

# AGENTES SUGERIDOS PARA LA IMPLEMENTACIÓN

Cuando estés listo para implementar, podemos usar los siguientes tipos de agentes:

| Agente | Área de Trabajo |
|--------|-----------------|
| `react-performance-optimization` | Optimización de FlatList, memoización, lazy loading |
| `mobile-developer` | Almacenamiento seguro, NFC, configuración nativa |
| `graphql-architect` | Unificación de clientes, tipado de queries |
| `general-purpose` | Refactorización general, estructura, tests |

---

**Documento generado:** 2026-01-21
**IDs de agentes para continuar:**
- Arquitectura: `a23ac97`
- Seguridad: `addb966`
- Rendimiento: `a1d3fce`
