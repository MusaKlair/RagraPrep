/**
 * Service Factory - Dependency Injection Container
 * Follows Dependency Inversion Principle (DIP)
 * Provides centralized creation of services with their dependencies
 * 
 * This factory pattern allows for easy testing and swapping of implementations
 */
import { IRepository } from '../interfaces/IRepository';
import { IEmbeddingService } from '../interfaces/IEmbeddingService';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { QuestionService } from '../services/QuestionService';
import { EmbeddingService } from '../services/EmbeddingService';
import { UserRepository } from '../repositories/UserRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { AnswerRepository } from '../repositories/AnswerRepository';
import { User } from '../models/User';
import { Question } from '../models/Question';
import { Answer } from '../models/Answer';

export class ServiceFactory {
  private static userRepository: IRepository<User> | null = null;
  private static questionRepository: IRepository<Question> | null = null;
  private static answerRepository: IRepository<Answer> | null = null;
  private static embeddingService: IEmbeddingService | null = null;

  /**
   * Get or create UserRepository instance (Singleton pattern)
   */
  static getUserRepository(): IRepository<User> {
    if (!this.userRepository) {
      this.userRepository = new UserRepository();
    }
    return this.userRepository;
  }

  /**
   * Get or create QuestionRepository instance
   */
  static getQuestionRepository(): IRepository<Question> {
    if (!this.questionRepository) {
      this.questionRepository = new QuestionRepository();
    }
    return this.questionRepository;
  }

  /**
   * Get or create AnswerRepository instance
   */
  static getAnswerRepository(): IRepository<Answer> {
    if (!this.answerRepository) {
      this.answerRepository = new AnswerRepository();
    }
    return this.answerRepository;
  }

  /**
   * Get or create EmbeddingService instance
   */
  static getEmbeddingService(): IEmbeddingService {
    if (!this.embeddingService) {
      this.embeddingService = new EmbeddingService();
    }
    return this.embeddingService;
  }

  /**
   * Create AuthService with dependencies
   */
  static createAuthService(): AuthService {
    return new AuthService(this.getUserRepository() as UserRepository);
  }

  /**
   * Create UserService with dependencies
   */
  static createUserService(): UserService {
    return new UserService(this.getUserRepository() as UserRepository);
  }

  /**
   * Create QuestionService with dependencies
   */
  static createQuestionService(): QuestionService {
    return new QuestionService(
      this.getQuestionRepository() as QuestionRepository,
      this.getAnswerRepository() as AnswerRepository,
      this.getEmbeddingService()
    );
  }

  /**
   * Reset all instances (useful for testing)
   */
  static reset(): void {
    this.userRepository = null;
    this.questionRepository = null;
    this.answerRepository = null;
    this.embeddingService = null;
  }
}

