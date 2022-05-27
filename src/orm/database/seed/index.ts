
import { createRoles } from "./roles.seed"

const createData = async() => {
    await createRoles();
}

export { createData }