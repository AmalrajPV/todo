import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [taskCategory, setTaskCategory] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5233/api/Todo');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async () => {
    try {
      if (taskText.trim() !== '' && taskCategory !== '') {
        const newTask = {
          task: taskText,
          category: taskCategory,
          status: false,
        };
        await axios.post('http://localhost:5233/api/Todo', newTask);
        setTaskText('');
        setTaskCategory('');
        fetchTasks();
      }else{
        alert("Add nessessary fields");
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async (taskId, newText) => {
    try {
      await axios.put(`http://localhost:5233/api/Todo/${taskId}`, { task: newText });
      fetchTasks();
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5233/api/Todo/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleTaskStatus = async (taskId) => {
    try {
      await axios.patch(`http://localhost:5233/api/Todo/${taskId}/toggle`);
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Todo List</h2>
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={8}>
          <Form>
            <Row className="align-items-center">
              <Col xs="7">
                <Form.Label htmlFor="inlineFormInput" visuallyHidden>
                  Task
                </Form.Label>
                <Form.Control
                  id="inlineFormInput"
                  placeholder="Enter Task..."
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                />
              </Col>
              <Col xs="4">
                <Form.Select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                >
                  <option value="">Choose Category</option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                </Form.Select>
              </Col>
              <Col xs="1">
                <Button variant="success" onClick={handleAddTask}>
                  +
                </Button>
              </Col>
            </Row>
          </Form>
          <Row className="mt-4">
            <Col>
              <ListGroup>
                {tasks.map((task) => (
                  <ListGroup.Item key={task.id}>
                    <Row>
                    <Col xs="1">
                    <Form.Check
                      type="checkbox"
                      inline
                      checked={task.status}
                      onChange={() => handleToggleTaskStatus(task.id)}
                    />
                    </Col>
                    <Col xs="7" style={{ textDecoration: task.status ? 'line-through' :'none'}}>
                    {task.task}
                    </Col>
                    <Col className="d-flex justify-content-end" xs="4">
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          const newText = prompt('Edit task:', task.task);
                          if (newText !== null) {
                            handleEditTask(task.id, newText);
                          }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </Button>
                    </Col>
                </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default TodoApp;
