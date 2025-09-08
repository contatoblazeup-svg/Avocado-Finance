const UNISWAP_V3_SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"

export interface GraphQLResponse<T> {
  data: T
  errors?: Array<{ message: string }>
}

export async function fetchGraphQL<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  try {
    const response = await fetch(UNISWAP_V3_SUBGRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: GraphQLResponse<T> = await response.json()

    if (result.errors) {
      throw new Error(result.errors.map((e) => e.message).join(", "))
    }

    return result.data
  } catch (error) {
    console.error("GraphQL fetch error:", error)
    throw error
  }
}
