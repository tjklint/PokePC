Your [project](https://vikramsinghmtl.github.io/420-4W6-Web-Programming-II/project/specifications) proposal will go here. Since you have to write your proposal in markdown, I've provided the sample proposal below so you have a reference for the syntax. Don't worry about getting rid of my stuff below since there's the live [sample proposal](https://vikramsinghmtl.github.io/420-4W6-Web-Programming-II/project/example-proposal) copy on the notes website.

---

![Banner](images/collab.png)

Introducing "Taskr" – a collaborative task management platform where teams, families, or study groups can manage shared projects and hold each other accountable. This app is for:

-   Small teams and project groups needing a lightweight way to coordinate tasks.
-   Households or roommates looking to organize shared chores and responsibilities.
-   Students working on group assignments.

Many existing task managers are overly complex for small-scale collaboration or lack features to foster a sense of shared ownership. Taskr aims to bridge the gap, providing the right balance of structure and simplicity for coordination.

## 🧱 Core Functionality

-   **Project Creation:** Users can create new shared projects with a title and basic description.
-   **User Management:** Users can join existing projects using a unique project code.
-   **Task Management:** Within a project, users can:
    -   Create new tasks with descriptions and due dates.
    -   Assign tasks to specific project members.
    -   Mark tasks as completed.
-   **Basic Notifications:** Users receive notifications when assigned a task or when a task they're involved in is marked complete.
-   **In-Task Chat:** Simple comment threads attached to tasks for focused discussions.
-   **Custom Task Statuses:** Ability to define statuses beyond "Not Started" and "Completed" (e.g., "In Progress", "Blocked")

### Requirements

#### Task Stories

-   As a user, I want to create a task so that I can keep track of what I have to get done.
-   As a user, I want to view my tasks in a list so I can see what needs my attention.
-   As a user, I want to edit a task to update its details or due date.
-   As a user, I want to mark a task as complete so I can track my progress.
-   As a user, I want to delete a task when it's no longer relevant.

#### Project Stories

-   As a user, I want to create a new project so I can organize a set of related tasks.
-   As a user, I want to join a project using an invite code so I can collaborate with others.
-   As a user, I want to view all projects I'm part of to easily switch between them.

#### User Management Stories

-   As a user, I want to register for an account so I can start using the app.
-   As a user, I want to log in to my account to access my tasks and projects.
-   As a user, I want to log out of my account to securely end my session.

#### Comment Stories

-   As a user, I want to leave a comment on a task to ask for clarification or provide an update.
-   As a user, I want to see comments from other team members on a task to stay on the same page.
-   As a user, I want to be notified if there's a new comment on a task I'm involved with.

#### Status Stories

-   As a user, I want to mark a task as "In Progress" to signal that I'm actively working on it.
-   As a user, I want to mark a task as "Blocked" to indicate that I can't proceed due to a dependency.
-   As a user, I want to view tasks grouped by their status to get a quick overview of the project's health.

## ᛦ Entity Relationships

>[!note]
> If you view the source code for this README file, you'll see the Mermaid syntax that generated the following diagram. You can copy the code into the [live Mermaid editor](https://mermaid.live) to play around and make changes specific to your app.

```mermaid
erDiagram
    PROJECT ||--o{ TASK : contains
    PROJECT ||--o{ USER_PROJECT : "is managed by"
    USER |o--o{ TASK : "assigned to"
    USER ||--o{ USER_PROJECT : "works on"
    TASK ||--o{ SUBTASK : has
    TASK ||--o{ NOTIFICATION: emits
    TASK ||--o{ COMMENT: has
    USER ||--o{ COMMENT: writes
    NOTIFICATION ||--o{ USER_NOTIFICATION: pings
    USER ||--o{ USER_NOTIFICATION: receives

    USER_PROJECT {
        int user_id PK, FK
        int project_id PK, FK
    }

    TASK {
        int id PK
        string title
        string description
        enum status "complete | in progress | unassigned | blocked"
        date created_at
        date edited_at
        int project_id FK
        int assignee FK
    }

    SUBTASK {
        int id PK
        string title
        date created_at
        date edited_at
        int task_id FK
    }

    PROJECT {
        int id PK
        string title
        string description
        date created_at
        date edited_at
    }

    USER {
        int id PK
        string email
        string name
        date created_at
        date edited_at
    }

    COMMENT {
        int id PK
        string content
        date created_at
        date edited_at
        id user_id FK "comment author"
        id task_id FK
    }

    NOTIFICATION {
        int id PK
        string content
        date created_at
        id task_id FK
    }

    USER_NOTIFICATION {
        int user_id PK, FK
        int notification_id PK, FK
    }
```

-   **Authentication System:** Handling user registration, login, logout, and session management.
-   **Project Management:** Logic for project creation, joining projects, and CRUD operations on projects.
-   **Task Management:** Logic for task creation, assignment, updates, filtering, and notifications.
-   **UI Elements:** Design of forms, task lists, project overview, notification lists.

## 📍 API Routes

>[!note]
> These are only a few routes to give you an idea, these would definitely not be all the routes for this kind of app!

### Project Management

| Request              | Action                           | Response              | Description                                                             |
| -------------------- | -------------------------------- | --------------------- | ----------------------------------------------------------------------- |
| POST /projects       | ProjectController::createProject | 201 /projects/:id     | Create a new project and redirect to the project's view                 |
| GET /projects/:id    | ProjectController::getProject    | 200 ProjectDetailView | Retrieve details of a specific project                                  |
| PUT /projects/:id    | ProjectController::updateProject | 200 ProjectDetailView | Update an existing project's information                                |
| DELETE /projects/:id | ProjectController::deleteProject | 204 (No Content)      | Delete a project (consider implications – should tasks be deleted too?) |

### Task Management

| Request                                   | Action                     | Response                 | Description                        |
| ----------------------------------------- | -------------------------- | ------------------------ | ---------------------------------- |
| POST /projects/:projectId/tasks           | TaskController::createTask | 201 /projects/:projectId | Create a new task within a project |
| GET /projects/:projectId/tasks/:taskId    | TaskController::getTask    | 200 TaskDetailView       | Retrieve a specific task's details |
| PUT /projects/:projectId/tasks/:taskId    | TaskController::updateTask | 200 TaskDetailView       | Edit an existing task              |
| DELETE /projects/:projectId/tasks/:taskId | TaskController::deleteTask | 204 (No Content)         | Delete a task                      |

## 📐 Wireframes

>[!note]
> Don't go crazy detailed with the wireframes! These should be minimal sketches to convey to the customer what the app will roughly look like. These things tend to change over time as requirements evolve, but you need to start from somewhere.

![Login View](images/login-view.png)

The login view is the initial screen where users can enter their credentials to log into their account. It typically consists of a form with input fields for the username/email and password, along with a "Login" button. The login view should also include a link to the registration page for new users who don't have an account yet.

![List View](images/list-view.png)

All the tasks for the logged in user where they can sort by title, due date, and created date. They can also filter tasks to only see completed or uncompleted tasks. The user can check off tasks here, or if they want a more detailed view, can click on one of the tasks (see next view).

![Show View](images/show-view.png)

This view shows the user more details for one specific task. If a due date was set, it will tell them how many days from now the task is due. There is a description field to provide more context for the task, as well as task actions to mark the task as complete, edit the task, or delete. On the right we have a sub-task list so that the user can breakdown the task steps even further. The sub-tasks can be checked off when completed.

![Profile View](images/profile-view.png)

The user profile shows the user's profile picture if set, and gives them a place where they can update their email and password. Here is also where they can control if the site is displayed in light or dark mode depending on the value of the toggle switch.
