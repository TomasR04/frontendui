# 12.5.2026

## Změny

- vytvoření update page
- implementování komponenty pro přídávání rolí
- úpráva UpdateAsyncAction.jsx, aby se odesílala pouze určitá data a ne celý objekt

## Problémy k vyřešení

- získání autorizace pro úpravy
- odesílání celého objektu místo určitých dat

## Objevy

- komplexnost a přísnost RBAC rolí
- provázanost projektu

## Problémy

- získání autorizace na úpravu studijního programu, nakonec řešeno přes komponentu, ve které si můžeme role libovolně přidávat
- UpdateAsyncAction.jsx odesílalo po úpravě studijního programu celý objekt, který backend nedokázal zpracovat. Bylo třeba úprav pro odesílání pouze určitých dat na server






# 11.4.2026

## Změny

- vytvoření apps/app_program
- vytvoření packages/program
- úprava Fragments.jsx
- úprava MediumContent.jsx
- publikace npm

## Problémy k vyřešení

- funkčnost a využití queries
- obsah a návaznost entit
- formulace dotazů

## Objevy

- komplexnost projektu
- funkčnost a dynamika MediumContent

## Problémy

- v určitých entitách dotazy (query) vracely na místo očekávaných dat null, využili jsme dat, které byly k dispozici
- využití queries a vytvoření vlastních sránek



# Jak spustit konrétní app

```cmd
npm run dev -w @hrbolek/app_dynamic
```

# Jak sestavit konrétní app

```cmd
npm run build -w @hrbolek/app_dynamic
```