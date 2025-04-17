import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Importation du plugin d'interaction
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { Priority, Status, Task } from '../../models/task.model';
import moment from 'moment';
import Swal from 'sweetalert2';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Mission } from '../../models/mission.model';
@Component({
  selector: 'app-task',
  standalone: false,
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit {
  taskForm: boolean = false;
  showCalendar: boolean = true;
  showUploadForm: boolean = false;
  constructor(private taskService:TaskService,private router:Router) { }
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  ngOnInit(): void {
    this.getTasksInCalendar();
  }
  tasks: Task[] = [];
  task: Task = {id:null, title: '', startDate: '', dueDate: '', description: '' , status: Status.UNREACHED, priority: Priority.LOW};
  taskColors: { [taskName: string]: string } = {}; // Stocke les couleurs par task
  priorities = Object.values(Priority);
  statuses = Object.values(Status);
  selectedFile: File | null = null;
  taskId: number | null = null;  // Modifie pour accepter null
  missionForm: boolean = false; // Pour afficher le formulaire de mission
  mission:Mission = {id:null, explanation:''}; // Modifie pour accepter null
  private genAI = new GoogleGenerativeAI('AIzaSyDy8ck9bmDHeY71p-Lg8TFYU5X2GM1wG18'); // ta clé de gemini
  missions: Mission[] = [];
  missionListForm: boolean = false; // Pour afficher la liste des missions
  calendarOptions: any = {
  plugins: [dayGridPlugin,interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
  left: 'prev,next today',
  center: 'title',
  right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
  events: [],
  eventClick: this.handleEventClick.bind(this), // Ajoute le gestionnaire d'événements pour le clic

  };
  switchToDayView(): void {
    this.calendarComponent.getApi().changeView('dayGridDay');
  }

  switchToMonthView(): void {
    this.calendarComponent.getApi().changeView('dayGridWeek');
  }

  switchToWeekView(): void {
    this.calendarComponent.getApi().changeView('dayGridMonth');
  }

  handleEventClick(clickInfo: any): void {
    const task: Task = clickInfo.event.extendedProps.task; // Récupérer la tâche cliquée
    this.taskId = task.id; // Stocker l'ID de la tâche sélectionnée
    // Vérifier le statut de la tâche
    if (task.status !== Status.DONE) {
      this.openMissionForm(task.id!); // Ouvre le formulaire de mission si la tâche n'est pas terminée
    } else {
      this.OpenUploadForm(); // Ouvre le formulaire d'upload si la tâche est terminée
    }
  }
  OpenUploadForm() {
    this.showCalendar = false;
    this.showUploadForm = true;
  }

  getTasksInCalendar(){
    this.showCalendar = true;
    this.taskService.getTasks().subscribe((response: any) => {
      const tasks = response as Task[];
      const events = tasks.flatMap(task => {
        const color = this.getColorForTask(task.title); // Obtenez la couleur pour le module
        // Ajouter un jour à la date de fin pour inclure le dernier jour complet
        const endDate = moment(task.dueDate).add(1, 'days').toISOString();
        return {
          title: task.title,
          start: task.startDate,
          end: endDate,
          color: color, // Utilisez la couleur associée à la séance
          extendedProps: { task: task } // Ajout de l'objet task dans extendedProps
        };
      });
      // Assurez-vous de vider les événements actuels avant de les redéfinir
      this.calendarOptions.events = [];
      this.calendarOptions.events = events;
    });
  }


  getColorForTask(taskName: string): string {
    if (!this.taskColors[taskName]) {
      this.taskColors[taskName] = this.generateRandomColor(); // Générez une nouvelle couleur si le module n'en a pas
    }
    return this.taskColors[taskName];
  }

  generateRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  addTask() {
    const today = moment(); // Date d'aujourd'hui
    const twoDaysLater = moment().add(2, 'days'); // Date après 2 jours
    // Vérifier si la startDate de la tâche est inférieure à deux jours après la date actuelle
    if (moment(this.task.startDate).isBefore(twoDaysLater, 'day')) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: 'You cannot add a task with a start date less than two days from now'
      });
      return;  // Ne pas ajouter la tâche si la date est incorrecte
    } else {
      this.taskService.addTask(this.task).subscribe((response: any) => {
        this.getTasksInCalendar();
      });
      window.location.reload();
    }
  }

  closeTaskForm() {
    this.showCalendar = true;
    this.taskForm = false;
    console.log("Task form closed");
  }

  OpenTaskForm() {
    this.showCalendar = false;
    this.taskForm = true;
      console.log("Task form opened");
      this.missionForm = false; // Masquer le formulaire de mission
      this.missionListForm = false; // Masquer le formulaire de mission
    }

      onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
      }

      onSubmit() {
        if (this.selectedFile) {
          this.taskService.updateTask(this.taskId, this.selectedFile).subscribe({
            next: (response) => alert(response),  // ✅ Succès
            //retour au calendrier après 6s
            complete: () => {
              setTimeout(() => {
                this.getTasksInCalendar();
                this.showCalendar = true;
                this.showUploadForm = false;
              }, 6000);
            },
            error: (error) => console.error('Erreur lors de la mise à jour', error) // ⚠️ Erreur
          });
        } else {
          alert('Veuillez sélectionner une image.');
        }
      }

      openMissionForm(taskId: number) {
        this.missionForm=true;
        this.taskId = taskId; // Stocker l'ID de la tâche sélectionnée
        this.showCalendar = false; // Masquer le calendrier
        this.missionListForm = false; // Masquer le formulaire de mission
        this.mission.explanation = ''; // Réinitialiser le champ d'explication
      }
      closeMissionForm() {
        this.missionForm=false;
        this.showCalendar = true; // Afficher le calendrier
        this.taskId = null; // Réinitialiser l'ID de la tâche sélectionnée
        this.mission.explanation = ''; // Réinitialiser le champ d'explication
      }

      async onSubmitMission() {
        if (this.mission.explanation) {
          const textToCheck = this.mission.explanation;

          const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

          const prompt = `Analyse le texte suivant et dis-moi si c'est vulgaire, offensant ou inapproprié. Réponds uniquement par "OK" ou "VULGAIRE".
          Texte: "${textToCheck}"`;

          try {
            const result = await model.generateContent(prompt);
            const response = await result.response.text();

            if (response.trim().toUpperCase().includes('VULGAIRE')) {
              Swal.fire({
                icon: 'warning',
                title: 'Texte inapproprié',
                text: 'Le texte de la réclamation contient des propos inappropriés.',
              });
              return;
            }
          this.taskService.createMissionAndAssignToTask(this.taskId!, this.mission).subscribe({
            next: (response) => alert(response),  // ✅ Succès
            complete: () => {
              setTimeout(() => {
                this.mission.explanation = ''; // Réinitialiser le champ d'explication
                this.getTasksInCalendar();
                this.missionForm = false;
              }, 4500);
            },
            error: (error) => console.error('Erreur lors de la mise à jour', error) // ⚠️ Erreur
          });
        } catch (err) {
          console.error(err);
          Swal.fire('Erreur', 'Une erreur est survenue lors de l’analyse du texte.', 'error');
        }
      }
    }


    loadMissionsByTaskId(taskId: number) {
      this.taskService.getMissionsByTask(taskId).subscribe({
        next: (data) => {
          this.missions = data;
        },
        error: (err) => {
          console.error("Erreur lors du chargement des missions :", err);
        }
      });
    }

    openMissionListForm() {
      const taskId = this.taskId; // Récupérer l'ID de la tâche sélectionnée
      if (!taskId) {
        console.error("Aucune tâche sélectionnée.");
        return;
      }
      this.missionListForm = true; // Afficher le formulaire de mission
      this.showCalendar = false; // Masquer le calendrier
      this.missionForm = false; // Masquer le formulaire de mission
      this.missions = []; // Réinitialiser la liste des missions
      this.taskId = taskId; // Stocker l'ID de la tâche sélectionnée
      this.taskId = taskId; // Stocker l'ID de la tâche sélectionnée
      this.loadMissionsByTaskId(this.taskId); // Charger les missions liées à cette tâche
      }

    closeMissionListForm() {
      this.missionListForm = false; // Masquer le formulaire de mission
      this.taskId = null; // Réinitialiser l'ID de la tâche sélectionnée
      this.missions = []; // Réinitialiser la liste des missions
      this.closeMissionForm(); // Fermer le formulaire de mission
      this.showCalendar = true; // Afficher le calendrier
      this.taskForm = false; // Masquer le formulaire de tâche
      }
}
