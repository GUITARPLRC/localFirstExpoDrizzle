import { Text, View } from "react-native"
import * as schema from "@/database/schema"
import { db } from "@/database"
import { useEffect, useRef } from "react"

export default function Index() {
	useEffect(() => {
		const run = async () => {
			console.log("running")
			const userData = await db.select().from(schema.user)
			if (userData.length === 0) {
				// we don't have a local user setup yet, let's create one
				db.insert(schema.user).values({}).run()
			}
		}
		run()
	}, [])

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text>Hello</Text>
		</View>
	)
}
