import { listItems } from "@/database/schema"
import { EvilIcons } from "@expo/vector-icons"
import { View, Pressable, Text } from "react-native"
import { eq } from "drizzle-orm"
import * as schema from "@/database/schema"
import { db } from "@/database"
import Checkbox from "expo-checkbox"

const ListItem = ({ item }: { item: listItems }) => {
	const handleDelete = async (id: string) => {
		await db.delete(schema.listItems).where(eq(schema.listItems.id, id))
	}

	const handleCompleted = async () => {
		await db
			.update(schema.listItems)
			.set({ isCompleted: item.isCompleted ? 0 : 1 })
			.where(eq(schema.listItems.id, item.id))
	}

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				borderRadius: 10,
				backgroundColor: "#555",
				padding: 20,
				marginBottom: 20,
			}}
		>
			<Checkbox
				value={!!item.isCompleted}
				onValueChange={handleCompleted}
				style={{ width: 20, marginRight: 10 }}
			/>
			<View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
				<Text
					style={{
						width: "85%",
						color: "white",
						fontSize: 24,
						textDecorationLine: item.isCompleted ? "line-through" : "none",
					}}
				>
					{item.title}
				</Text>
				<Pressable onPress={() => handleDelete(item.id)}>
					<EvilIcons name="trash" size={35} color="white" />
				</Pressable>
			</View>
		</View>
	)
}

export default ListItem
