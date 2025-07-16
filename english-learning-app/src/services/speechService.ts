import httpClient from './httpClient';
import type {
  GenerateSpeechRequest,
  GenerateSpeechResponse,
  ApiResponse,
} from '@/types';

/**
 * 语音服务类
 */
export class SpeechService {
  private static audioCache = new Map<string, string>();
  private static currentAudio: HTMLAudioElement | null = null;

  /**
   * 生成语音文件
   * @param request 语音生成请求参数
   * @returns 语音生成结果
   */
  static async generateSpeech(request: GenerateSpeechRequest): Promise<GenerateSpeechResponse> {
    try {
      // 检查缓存
      const cacheKey = this.getCacheKey(request);
      const cachedUrl = this.audioCache.get(cacheKey);
      
      if (cachedUrl) {
        console.log('🎵 Using cached audio:', cacheKey);
        return {
          audioUrl: cachedUrl,
          duration: 0, // 缓存的音频不返回时长
          text: request.text,
        };
      }

      const response = await httpClient.post<ApiResponse<GenerateSpeechResponse>>(
        '/speech/generate',
        {
          text: request.text,
          language: request.language || 'en',
          voice: request.voice || 'default',
          speed: request.speed || 1.0,
        }
      );

      if (!response.data.data) {
        throw new Error('语音生成响应数据为空');
      }

      const result = response.data.data;
      
      // 缓存音频URL
      this.audioCache.set(cacheKey, result.audioUrl);
      
      return result;
    } catch (error) {
      console.error('❌ Speech generation failed:', error);
      throw error;
    }
  }

  /**
   * 播放音频
   * @param audioUrl 音频URL
   * @param onProgress 播放进度回调
   * @param onEnd 播放结束回调
   * @returns Promise<void>
   */
  static async playAudio(
    audioUrl: string,
    onProgress?: (currentTime: number, duration: number) => void,
    onEnd?: () => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // 停止当前播放的音频
        this.stopAudio();

        const audio = new Audio(audioUrl);
        this.currentAudio = audio;

        // 设置事件监听器
        audio.addEventListener('loadedmetadata', () => {
          console.log('🎵 Audio loaded, duration:', audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
          if (onProgress) {
            onProgress(audio.currentTime, audio.duration);
          }
        });

        audio.addEventListener('ended', () => {
          console.log('🎵 Audio playback ended');
          this.currentAudio = null;
          if (onEnd) onEnd();
          resolve();
        });

        audio.addEventListener('error', (e) => {
          console.error('❌ Audio playback error:', e);
          this.currentAudio = null;
          reject(new Error('音频播放失败'));
        });

        // 开始播放
        audio.play().catch((error) => {
          console.error('❌ Audio play failed:', error);
          this.currentAudio = null;
          reject(new Error('音频播放失败，请检查音频文件'));
        });

      } catch (error) {
        console.error('❌ Audio setup failed:', error);
        reject(error);
      }
    });
  }

  /**
   * 停止音频播放
   */
  static stopAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
      console.log('⏹️ Audio stopped');
    }
  }

  /**
   * 暂停音频播放
   */
  static pauseAudio(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      console.log('⏸️ Audio paused');
    }
  }

  /**
   * 恢复音频播放
   */
  static resumeAudio(): void {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play().catch((error) => {
        console.error('❌ Audio resume failed:', error);
      });
      console.log('▶️ Audio resumed');
    }
  }

  /**
   * 检查是否正在播放
   */
  static isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
  }

  /**
   * 获取缓存键
   */
  private static getCacheKey(request: GenerateSpeechRequest): string {
    return `${request.text}_${request.language || 'en'}_${request.voice || 'default'}_${request.speed || 1.0}`;
  }

  /**
   * 清除音频缓存
   */
  static clearCache(): void {
    this.audioCache.clear();
    console.log('🗑️ Audio cache cleared');
  }

  /**
   * 获取缓存大小
   */
  static getCacheSize(): number {
    return this.audioCache.size;
  }
}

export default SpeechService;