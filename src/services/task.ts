import api from "./api";

export const getTasks = (params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sort?: string;
}) =>
  api.get("/tasks", {
    params,
  });


export const createTask = (data: {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string | null;
}) => api.post("/tasks", data);


export const updateTask = (id: string, data: any) =>
  api.patch(`/tasks/${id}`, data);

export const deleteTask = (id: string) =>
  api.delete(`/tasks/${id}`);

export const toggleTask = (id: string) =>
  api.patch(`/tasks/${id}/toggle`);
