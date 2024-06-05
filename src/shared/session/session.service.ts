import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Profile, User } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class SessionService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  /**
   *   @description: get user data
   */
  getUser() {
    try {
      const user = this.request['req'].user;
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   *   @description: get user data
   */
  getUserProfileId() {
    try {
      const user: string = this.request['req'].user.profile.id;
      return user;
    } catch (error) {
      return null;
    }
  }

  getUserProfileName() {
    try {
      const user: string = this.request['req'].user.profile.name;
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   *   @description: get user data
   */
  getUserWalletId() {
    try {
      const user: string = this.request['req'].user.wallet[0].id;
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   *   @description: get user data
   */
  getUserWalletAddress() {
    try {
      const user: string = this.request['req'].user.wallet[0].address;
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   *   @description: get user data
   */
  getUserName() {
    try {
      const user = this.request['req'].user.userName;
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   *   @description: get user id from token
   */
  getUserId() {
    try {
      return this.request['req'].user.id;
    } catch (error) {
      return null;
    }
  }

  /**
   *   @description: get user id from token
   */
  getUserEmail() {
    try {
      return this.request['req'].user.email;
    } catch (error) {
      return null;
    }
  }

  /**
   *   @description: get user's current organization from request
   */
  getUserOrganization() {
    try {
      return this.request['req'].user.currentOrganization;
    } catch (error) {
      return null;
    }
  }

  /**
   *   @description: get user's current organization from request
   */
  getUserOrganizationName() {
    try {
      return this.request['req'].user.currentOrganization.name;
    } catch (error) {
      return null;
    }
  }

  /**
   *   @description: get user's current organization ID from request
   */
  getUserOrganizationId() {
    try {
      return this.request['req'].user.currentOrganization.id;
    } catch (error) {
      return null;
    }
  }

  getUserOrganizationRole() {
    try {
      return this.request['req'].user.currentOrganization.OrganizationAccess[0].role;
    } catch (error) {
      return null;
    }
  }

  getUserRoleTitle() {
    try {
      const role = this.request['req'].user.role.title;
      return role;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
