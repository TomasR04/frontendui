const randomWords = [
    "Výchova",
    "Matematika",
    "Informatika",
    "Fyzika",
    "Technologie",
    "Chemie",
    "Biologie",
]

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)]

// Shuffle a copy so each run starts from a different order without mutating the source list.
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5)

export const GENERATE_AMOUNT = 3

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

// Convert the GraphQL result into a shuffled list that can be consumed one item at a time.
export const pickRandomEntityList = (result) => shuffle(entitiesFromResult(result))

export const makeRandomProgramName = (index) => {
    const left = pickRandom(randomWords)
    const right = pickRandom(randomWords)
    return `${left} ${right} ${index + 1}`
}

export const resolveRandomProgramIds = async ({
    runProgramTypes,
    runGroups,
}) => {
    // Load the full candidate sets once; the caller will pick a different entry for each program.
    const typePage = await runProgramTypes({ skip: 0, limit: 200 })
    const typeList = pickRandomEntityList(typePage)
    const groupPage = await runGroups({ skip: 0, limit: 200 })
    const groupList = pickRandomEntityList(groupPage)

    if (!typeList.length || !groupList.length) {
        return null
    }

    // Return only pools so the create loop can cycle through them by index.
    return {
        typePool: typeList.map((type) => type.id),
        licencedPool: groupList.map((group) => group.id),
        guarantorsPool: shuffle(groupList.map((group) => group.id)),
    }
}