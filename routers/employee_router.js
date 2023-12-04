const express = require('express')
const router = express.Router()
const dal = require('../dals/dal')

/**
*  @swagger
*  components:
*     schemas:
*       Employee:
*         type: object
*         required:
*           - id
*           - name
*           - age
*           - address
*           - salary
*         properties:
*           id:
*             type: number
*             description: The auto-generated id of the employee.
*           name:
*             type: string
*             description: The name of the employee.
*           age:
*             type: number
*             description: age of the employee
*           address:
*             type: string
*             description: The address of the employee.
*           salary:
*             type: number
*             description: salary of the employee
*         example:
*           name: Kim
*           age: 22
*           address: South-Hall
*           salary: 45000
*/



// '/api/employee'
// GET 

router.get('/hello', async (request, response) => {
    response.json({ 'status': 'success' })
})

// '/api/employee'
// GET 
/**
*  @swagger
*   /api/employee/:
*     get:
*       summary: List all of the employees
*       responses:
*         "200":
*           description: The list of employees.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Employee'
*/
router.get('/', async (request, response) => {
    try {
        const employees = await dal.get_all()
        response.json(employees)
    }
    catch (e) {
        response.status(500).json({ 'error': JSON.stringify(e) })
    }
})
// GET by ID
/**
 * @swagger
 * /api/employee/{id}:
 *   get:
 *     summary: Get an employee by ID
 *     description: Retrieve employee details based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the employee to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the employee details.
 *         content:
 *           application/json:
 *             example:
 *               ID: 1
 *               NAME: John Doe
 *               AGE: 30
 *               ADDRESS: Example Street
 *               SALARY: 50000.00
 *       404:
 *         description: Employee not found with the specified ID.
 *         content:
 *           application/json:
 *             example:
 *               error: cannot find employee with id {id}
 */
router.get('/:id', async (request, response) => {
    const user_id = parseInt(request.params.id)
    const user = await dal.get_by_id(user_id)
    if (user) {
        response.json(user)
    }
    else {
        response.status(404).json({ "error": `cannot find user with id ${user_id}` })
    }
})
// POST
/**
 * @swagger
 * /api/employee:
 *   post:
 *     summary: Create a new employee
 *     description: Create a new employee record with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NAME:
 *                 type: string
 *                 description: The name of the employee.
 *               AGE:
 *                 type: number
 *                 description: The age of the employee.
 *               ADDRESS:
 *                 type: string
 *                 description: The address of the employee.
 *               SALARY:
 *                 type: number
 *                 description: The salary of the employee.
 *             example:
 *               name: John Doe
 *               age: 30
 *               address: Example Street
 *               salary: 50000.00
 *     responses:
 *       201:
 *         description: Employee created successfully.
 *         content:
 *           application/json:
 *             example:
 *               ID: 1
 *               NAME: John Doe
 *               AGE: 30
 *               ADDRESS: Example Street
 *               SALARY: 50000.00
 *       400:
 *         description: Bad request. Ensure all required fields are provided.
 *         content:
 *           application/json:
 *             example:
 *               error: Bad request. Missing required fields.
 */
router.post('/', async (request, response) => {
    try {
        const new_user = request.body
        const result = await dal.new_employee(new_user)
        response.status(201).json(result)
    }
    catch (e) {
        response.status(400).json({ 'Error': e })
    }
})
// PUT
router.put('/:id', async (request, response) => {
    try {
        const user_id = parseInt(request.params.id)
        const user = await dal.get_by_id(user_id)
        if (user) {
            // user exists ==> perform update
            const updated_user_req = request.body
            const result = await dal.update_emplyee(user_id, updated_user_req)
            response.status(200).json(updated_user_req)
        }
        else {
            // user does NOT exist ==> perform insert
            const new_user = request.body
            const result = await dal.new_employee(new_user)
            response.status(201).json(result)
        }
    }
    catch (e) {
        response.status(400).json({ 'Error': e })
    }
})
// PATCH
router.patch('/:id', async (request, response) => {
    try {
        const updated_user_req = request.body
        const user_id = parseInt(request.params.id)
        const user = await dal.get_by_id(user_id)
        // override only existing fields in the user from the db
        if (!user) {
            response.status(404).json({ "error": `cannot find user with id ${user_id}` })
            return
        }
        const result = await dal.update_emplyee(user_id, { ...user, ...updated_user_req })
        response.status(200).json({ result })
    }
    catch (e) {
        response.status(400).json({ 'Error': e })
    }
})

// DELETE
/**
 * @swagger
 * /api/employee/{id}:
 *   delete:
 *     summary: Delete an employee by ID
 *     description: Delete the employee record with the specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the employee to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Employee deleted successfully.
 *       404:
 *         description: Employee not found with the specified ID.
 *         content:
 *           application/json:
 *             example:
 *               error: cannot find employee with id {id}
 */
router.delete('/:id', async (request, response) => {
    try {
        const user_id = parseInt(request.params.id)
        const result = await dal.delete_employee(user_id)
        response.status(204).json({ result })
    }
    catch (e) {
        response.status(400).json({ 'Error': e })
    }
})

module.exports = router

