import { useParams } from "react-router"

/**
 * TemplateEditPage Component
 *
 * Stránková komponenta pro lazy-loaded editaci entity `template`.
 *
 * - Získává `id` z URL parametrů pomocí `useParams` (např. `/template/:id`).
 * - Vytvoří objekt `template` s tímto `id` a předává jej do komponenty `TemplatePageContentLazy`,
 *   která se stará o asynchronní načtení dat z backendu.
 * - Uvnitř `TemplatePageContentLazy` vykresluje editační rozhraní pomocí `TemplateLiveEdit` a případně další obsah.
 *
 * Pokud předáš children jako render-funkci, ta obdrží:
 *   - `template` — kompletně načtený entity objekt,
 *   - `onChange` — callback pro změnu hodnoty pole,
 *   - `onBlur` — callback pro blur event (typicky při opuštění pole).
 *
 * @component
 * @param {Object} props - Props objekt.
 * @param {(args: { template: Object, onChange: function, onBlur: function }) => React.ReactNode} [props.children]
 *   Volitelná render-funkce nebo prvek. Pokud je funkce, předá hodnoty z `TemplatePageContentLazy`.
 *
 * @returns {JSX.Element}
 *   Kompletní stránka pro lazy editaci šablony (template) podle ID z URL.
 *
 * @example
 * // Základní použití v routeru:
 * <Route path="/template/:id" element={<TemplateEditPage />} />
 *
 * @example
 * // Pokročilé použití s render-funkcí pro vlastní zobrazení obsahu:
 * <Route
 *   path="/template/:id"
 *   element={
 *     <TemplateEditPage>
 *       {({ template, onChange, onBlur }) => (
 *         <input value={template.name} onChange={onChange} onBlur={onBlur} />
 *       )}
 *     </TemplateEditPage>
 *   }
 * />
 */
export const EditPage = ({ children }) => {
    const {id} = useParams()
    const item = {id}
    return (
        <PageContentLazy item={item}>
            <LiveEdit item={item} />
            {children}
        </PageContentLazy>
    )
}