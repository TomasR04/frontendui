// Utility helpers for generating random program data.
// This module builds random program names and extracts related entity IDs
// from GraphQL query results so seed/demo generation can run consistently.

const leftRandomWords = [
    "Vojenská",
    "Technická",
    "Informační",
    "Vědecká",
    "Výzkumná",
    "Vývojová",
]

const rightRandomWords = [
    "Výchova",
    "Matematika",
    "Informatika",
    "Fyzika",
    "Technologie",
    "Chemie",
    "Biologie",
]

// Pick a random element from an array.
const pickRandom = (items) => items[Math.floor(Math.random() * items.length)]

// Return a shuffled copy of the provided array without mutating it.
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5)

export const GENERATE_AMOUNT = 3

// Extract a list of entities from a flexible GraphQL result shape.
// Supports direct arrays, `data`, `result`, and nested `items` payloads.
export const entitiesFromResult = (result) => {
    const candidates = [result, result?.data, result?.result, result?.data?.result]

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) return candidate
        if (Array.isArray(candidate?.items)) return candidate.items
        if (Array.isArray(candidate?.result)) return candidate.result
    }

    for (const candidate of candidates) {
        if (candidate?.items?.length) return candidate.items
        if (candidate?.result?.items?.length) return candidate.result.items
    }

    return []
}

export const pickRandomEntity = (result) => {
    const entities = entitiesFromResult(result)
    if (!entities.length) return null
    return entities[Math.floor(Math.random() * entities.length)] ?? null
}

// Return a randomized list of entities that can be used as a candidate pool.
export const pickRandomEntityList = (result) => shuffle(entitiesFromResult(result))

// Generate a random program title from two word sets and the item index.
export const makeRandomProgramName = (index) => {
    const left = pickRandom(leftRandomWords)
    const right = pickRandom(rightRandomWords)
    return `${left} ${right} ${index + 1}`
}

export const resolveRandomProgramIds = async ({
    runProgramTypes,
    runGroups,
}) => {
    // Load candidate pools from the API once.
    const typePage = await runProgramTypes({ skip: 0, limit: 200 })
    const typeList = pickRandomEntityList(typePage)

    const groupPage = await runGroups({ skip: 0, limit: 200 })
    const groupList = pickRandomEntityList(groupPage)

    if (!typeList.length || !groupList.length) {
        return null
    }

    // Return only ID arrays so the caller can assign related IDs by index.
    return {
        typePool: typeList.map((type) => type.id),
        licencedPool: groupList.map((group) => group.id),
        guarantorsPool: shuffle(groupList.map((group) => group.id)),
    }
}