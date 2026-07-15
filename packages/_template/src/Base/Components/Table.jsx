import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "./Link";
import { CreateButton, CreateLink } from "../Mutations/Create";
import { UpdateButton, UpdateLink } from "../Mutations/Update";
import { DeleteButton } from "../Mutations/Delete";

const CellId = ({ row, name }) => (
    <td key={name}>
        <Link item={row}>{row?.id || "Data Error"}</Link>
    </td>
)

export const CellName = ({ row, name }) => (
    <td key={name}>
        <Link item={row} />
    </td>
)

const CellNestedLink = ({ row, name }) => {
    
    const parentKey = name.split(".")[0]
    const nestedItem = row?.[parentKey]

    return (
        <td key={name}>
            <Link item={nestedItem} />
        </td>
    )
}

const CellDefault = ({ row, name }) => {
    const value = name.includes(".") ? getByPath(row, name) : (row?.[name] ?? "")

    const idpos = name.indexOf("Id")
    if (idpos === -1) {
        return <td key={name}>{typeof value === "object" ? `${value}` : (value || "")}</td>
    }

    const scalarname = name.replace("Id", "")
    const { id, __typename } = row?.[scalarname] || {}

    if (id && __typename && id == value) {
        return (
            <td key={name}>
                <Link item={row?.[scalarname]}>{value || ""}</Link>
            </td>
        )
    }

    return <td key={name}>{typeof value === "object" ? `${value}` : (value || "")}</td>
}

export const LABELS = {
    __typename: "Typ",
    id: "ID",
    name: "Název",
    nameEn: "Název (EN)",
    lastchange: "Poslední změna",
    created: "Vytvořeno",
    createdbyId: "Vytvořil",
    changedbyId: "Změnil",
    rbacobjectId: "RBAC objekt",
    subjects: "Předměty",
    students: "Studenti",
    guarantors: "Garanti",
    licencedGroup: "Licencovaná skupina",
    type: "Typ programu",
    user: "Uživatel",
    fullname: "Jméno",
    tools: "Nástroje",
}

export const translateLabel = (name) => {
    if (LABELS[name]) return LABELS[name]
    if (name.includes(".")) {
        // "user.fullname" -> first will try finding label for "fullname", then for "user"
        const parts = name.split(".")

        // if in LABELS, will be used, otherwise the original name will be used
        return LABELS[parts[0]] || LABELS[parts[1]] || name
    }
    return name
}

export const buildTableDef = (data) => {
    const row = data?.[0] ?? {}
    const priority = ["name"] 

    const HIDDEN_ATTRIBUTES = ["__typename", "id"] 

    const attribute_names = []

    Object.keys(row).forEach((attribute_name) => {
        if (HIDDEN_ATTRIBUTES.includes(attribute_name)) return 

        const v = row[attribute_name]
        if (Array.isArray(v)) return
        if (typeof v === "object" && v !== null) {
            const nestedKey = ["fullname", "name", "title"].find((k) => k in v)
            if (nestedKey) {
                attribute_names.push(`${attribute_name}.${nestedKey}`)
            }
            return
        }
        attribute_names.push(attribute_name)
    })

    const columns = [
        ...priority.filter((a) => attribute_names.includes(a)),
        ...attribute_names.filter((a) => !priority.includes(a)),
    ]

    const result = Object.fromEntries(
    columns.map((name) => {
        let component = CellDefault
        if (name === "id") component = CellId
        if (name === "name") component = CellName
        if (name.includes(".")) component = CellNestedLink

        return [
            name,
            {
                label: translateLabel(name),   // <-- tady
                component,
            },
        ]
    })
)

    result["tools"] = {
    label: translateLabel("tools"),   // nebo rovnou "Nástroje", jak už máš
    component: ({row}) => <td><KebabMenu actions={[
            { children: <Link className="btn btn-sm btn-outline-secondary border-0 text-start w-100" item={row}>Detail</Link> },
            { children: <UpdateLink className="btn btn-sm btn-outline-secondary border-0 text-start w-100" item={row} action="edit">Editovat</UpdateLink> },
            // { children: <UpdateButton className="btn btn-sm btn-outline-secondary border-0 text-start w-100" item={row}>Editovat (zde)</UpdateButton> },
            // { children: <DeleteButton className="btn btn-sm btn-outline-secondary border-0 text-start w-100">Smazat</DeleteButton> },
        ]} /></td>,
    }

    return result
}


export const KebabMenu = ({ actions = [] }) => {
    const [open, setOpen] = useState(false);
    const btnRef = useRef(null);
    const menuRef = useRef(null);
    const [pos, setPos] = useState({ left: 0, top: 0 });

    const close = () => setOpen(false);

    
    useEffect(() => {
        if (!open) return;

        const onMouseDown = (e) => {
            const btn = btnRef.current;
            const menu = menuRef.current;
            if (!btn || !menu) return;

            if (btn.contains(e.target)) return;
            if (menu.contains(e.target)) return;

            close();
        };

        const onKeyDown = (e) => {
            if (e.key === "Escape") close();
        };

        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    // spočítat pozici po otevření + při scroll/resize
    useLayoutEffect(() => {
        if (!open) return;

        const update = () => {
            const btn = btnRef.current;
            if (!btn) return;

            const r = btn.getBoundingClientRect();
            // menu zarovnané doprava k tlačítku, pod tlačítkem
            setPos({
                left: r.right + window.scrollX,
                top: r.bottom + window.scrollY,
            });
        };

        update();

        window.addEventListener("resize", update);
        // scroll na capture, aby to fungovalo i při scrollu uvnitř wrapperů
        window.addEventListener("scroll", update, true);

        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update, true);
        };
    }, [open]);

    const menu = open ? (
        <div
            ref={menuRef}
            style={{
                position: "absolute",
                left: pos.left,
                top: pos.top,
                transform: "translateX(-100%)", // right align
                background: "white",
                border: "1px solid #ddd",
                borderRadius: 4,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 2000,
                minWidth: 140,
            }}
            role="menu"
        >
            {actions.map((action, i) => {
                const children = action?.children;
                if (children) return <div key={i}>{children}</div>;

                return (
                    <button
                        key={i}
                        type="button"
                        className="btn btn-sm btn-outline-secondary border-0 text-start w-100"
                        onClick={() => {
                            close();
                            action?.onClick?.();
                        }}
                        style={{
                            padding: "8px 12px",
                            textDecoration: "none",
                        }}
                        role="menuitem"
                    >
                        {action?.label}
                    </button>
                );
            })}
        </div>
    ) : null;

    return (
        <>
            <button
                ref={btnRef}
                className="btn btn-sm btn-outline-secondary border-1"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-haspopup="menu"
                aria-label="Menu"
                type="button"
            >
                ⋮
            </button>

            {open ? createPortal(menu, document.body) : null}
        </>
    );
};

const getByPath = (obj, path) =>
    path.split(".").reduce((acc, key) => acc?.[key], obj)

export const TableRow = ({ row, table_def }) => {
    return (
        <tr>
            {Object.keys(table_def).map((name) => {
                const Cell = table_def[name].component
                return <Cell key={name} row={row} name={name} />
            })}
        </tr>
    )
}

const TableRow_ = TableRow
// 3) Table už jen používá definici
export const TableBody = ({ data, table_def, TableRow = TableRow_ }) => {
    return (
        <tbody>
            {data.map((row) => <TableRow key={row?.id} row={row} table_def={table_def} />)}
        </tbody>
    )
}

const TableBody_ = TableBody

export const Table = ({ data, table_def = null, TableBody = TableBody_ }) => {
    if (!data || data.length === 0) return null
    
    const _table_def = useMemo(() => table_def || buildTableDef(data), [data, table_def])
    const colnames = useMemo(() => Object.keys(_table_def).map((k) => _table_def[k].label), [_table_def])
    // console.log(_table_def)
    return (
        <div className="table-responsive">
            <table className="table table-stripped">
                <thead>
                    <tr>
                        {colnames.map((name) => (
                            <th key={name}>{`${name}`}</th>
                        ))}
                    </tr>
                </thead>

                <TableBody data={data} table_def={_table_def} />
            </table>
        </div>
    )
}