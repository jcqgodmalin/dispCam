import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {

  @ViewChild('video') video!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  currentFacingMode: 'user' | 'environment' = 'user'; // Default to front camera

  async toggleCamera() {
    this.currentFacingMode = (this.currentFacingMode === 'user') ? 'environment' : 'user';
    await this.startCamera();
  }
  constructor() { }

  ngAfterViewInit(): void {
    this.startCamera();
  }

  async startCamera() {
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: { exact: this.currentFacingMode }
      }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if(this.currentFacingMode === 'user') {
        this.video.nativeElement.style.transform = 'scaleX(-1)';
      }else{
        this.video.nativeElement.style.transform = '';
      }
      this.video.nativeElement.srcObject = stream;
      this.video.nativeElement.play(); // Start playing the video
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }

  capture(): void {
    const videoElement = this.video.nativeElement;
    const canvasElement = this.canvas.nativeElement;
    const context = canvasElement.getContext('2d')!;

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    canvasElement.style.display = 'block';
  }
}
