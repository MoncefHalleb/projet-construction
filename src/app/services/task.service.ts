import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from '../models/task.model';
import { Mission } from '../models/mission.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  baseUrl = 'http://localhost:8888/TASK-SERVICE/tasks';
  constructor(private http:HttpClient,private router : Router) { }

  getTasks(){
    return this.http.get('http://localhost:8888/TASK-SERVICE/tasks');
  }

  getTaskById(id:number){
    return this.http.get('http://localhost:8888/TASK-SERVICE/tasks/'+id);
  }

  addTask(task:Task){
    return this.http.post('http://localhost:8888/TASK-SERVICE/tasks',task);
  }

  updateTask(id: any, photo: File) {
    const formData = new FormData();
    formData.append('photo', photo);  // Ajoute l'image au FormData
    return this.http.put(`${this.baseUrl}/${id}`, formData, { responseType: 'text' });
  }

  // 👇 Méthode pour créer une mission et l’affecter à un task existant
  createMissionAndAssignToTask(taskId: number, mission: Mission): Observable<string> {
    return this.http.post(`${this.baseUrl}/add-mission-to-task/${taskId}`, mission, {
      responseType: 'text' // 👈 important car le backend retourne une string !!
    });
  }

  getMissionsByTask(taskId: number): Observable<Mission[]> {
    return this.http.get<Mission[]>(`${this.baseUrl}/missions-by-task/${taskId}`);
  }

}
