import { styleContent, styleKey } from '../component/qrl-styles';
import type { QRL } from '../import/qrl.public';
import { implicit$FirstArg } from '../util/implicit_dollar';
import { scopeStylesheet } from '../style/scoped-stylesheet';
import { getContext } from '../props/props';
import { hasStyle } from '../render/execute-component';
import { useSequentialScope } from './use-sequential-scope';

// <docs markdown="../readme.md#useStyles">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useStyles instead)
/**
 * A lazy-loadable reference to a component's styles.
 *
 * Component styles allow Qwik to lazy load the style information for the component only when
 * needed. (And avoid double loading it in case of SSR hydration.)
 *
 * ```tsx
 * import styles from './code-block.css?inline';
 *
 * export const CmpStyles = component$(() => {
 *   useStyles$(styles);
 *
 *   return <Host>Some text</Host>;
 * });
 * ```
 *
 * @see `useStylesScoped`
 *
 * @public
 */
// </docs>
export const useStylesQrl = (styles: QRL<string>): void => {
  _useStyles(styles, (str) => str, false);
};

// <docs markdown="../readme.md#useStyles">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useStyles instead)
/**
 * A lazy-loadable reference to a component's styles.
 *
 * Component styles allow Qwik to lazy load the style information for the component only when
 * needed. (And avoid double loading it in case of SSR hydration.)
 *
 * ```tsx
 * import styles from './code-block.css?inline';
 *
 * export const CmpStyles = component$(() => {
 *   useStyles$(styles);
 *
 *   return <Host>Some text</Host>;
 * });
 * ```
 *
 * @see `useStylesScoped`
 *
 * @public
 */
// </docs>
export const useStyles$ = /*#__PURE__*/ implicit$FirstArg(useStylesQrl);

// <docs markdown="../readme.md#useStylesScoped">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useStylesScoped instead)
/**
 * A lazy-loadable reference to a component's styles, that is scoped to the component.
 *
 * Component styles allow Qwik to lazy load the style information for the component only when
 * needed. (And avoid double loading it in case of SSR hydration.)
 *
 * ```tsx
 * import scoped from './code-block.css?inline';
 *
 * export const CmpScopedStyles = component$(() => {
 *   useStylesScoped$(scoped);
 *
 *   return <Host>Some text</Host>;
 * });
 * ```
 *
 * @see `useStyles`
 *
 * @alpha
 */
// </docs>
export const useStylesScopedQrl = (styles: QRL<string>): void => {
  _useStyles(styles, scopeStylesheet, true);
};

// <docs markdown="../readme.md#useStylesScoped">
// !!DO NOT EDIT THIS COMMENT DIRECTLY!!!
// (edit ../readme.md#useStylesScoped instead)
/**
 * A lazy-loadable reference to a component's styles, that is scoped to the component.
 *
 * Component styles allow Qwik to lazy load the style information for the component only when
 * needed. (And avoid double loading it in case of SSR hydration.)
 *
 * ```tsx
 * import scoped from './code-block.css?inline';
 *
 * export const CmpScopedStyles = component$(() => {
 *   useStylesScoped$(scoped);
 *
 *   return <Host>Some text</Host>;
 * });
 * ```
 *
 * @see `useStyles`
 *
 * @alpha
 */
// </docs>
export const useStylesScoped$ = /*#__PURE__*/ implicit$FirstArg(useStylesScopedQrl);

const _useStyles = (
  styleQrl: QRL<string>,
  transform: (str: string, styleId: string) => string,
  scoped: boolean
) => {
  const { get, set, ctx, i } = useSequentialScope<boolean>();
  if (get === true) {
    return;
  }
  set(true);
  const renderCtx = ctx.$renderCtx$;
  const styleId = styleKey(styleQrl, i);
  const hostElement = ctx.$hostElement$;
  const containerState = renderCtx.$containerState$;
  const elCtx = getContext(ctx.$hostElement$);
  if (!elCtx.$appendStyles$) {
    elCtx.$appendStyles$ = [];
  }
  if (!elCtx.$scopeIds$) {
    elCtx.$scopeIds$ = [];
  }
  if (scoped) {
    elCtx.$scopeIds$.push(styleContent(styleId));
  }
  if (!hasStyle(containerState, styleId)) {
    containerState.$styleIds$.add(styleId);
    ctx.$waitOn$.push(
      styleQrl.resolve(hostElement).then((styleText) => {
        elCtx.$appendStyles$!.push({
          styleId,
          content: transform(styleText, styleId),
        });
      })
    );
  }
};
