import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import UserStats from '../../../models/UserStats';
import User from '../../../models/User';
import Badge from '../../../models/Badge';
import {BadgeService} from '../../../services/badge.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {
  /* ------ Loaded Services */
  loadedStats: UserStats;
  loadedBages: Badge[] = [];
  loggedUser: User;
  /* --- Back Url for badge images--- */
  backUrl = environment.apis.backUrl;


  constructor(private userService: UserService,
              private badgeService: BadgeService) {

  }

  ngOnInit() {
    this.getLoggedUser();
    this.loadAllBadges();
    this.loadUSerStats();
  }

  loadUSerStats() {
    this.userService.getUserStats().subscribe(stats => {
      this.loadedStats = stats;

    });
  }

  getLoggedUser() {
    this.userService.getUser().subscribe(user => {
      this.loggedUser = user;
    });
  }

  loadAllBadges() {
    this.badgeService.getAllBadges().subscribe(badges => {
      this.loadedBages = badges;
      console.log(this.loadedBages);

    });
  }

}
