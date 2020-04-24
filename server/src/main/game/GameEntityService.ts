import EntityService from "../entity/EntityService";
import { Game, Person, Player, Spectator } from "skipbo-common";
import { DuplicateError } from "../common/Errors";
import { isEqual } from "lodash";

export default class GameEntityService extends EntityService<Game> {
  constructor() {
    super(Game.ENTITY_NAME, () => new Game());
  }

  addPlayer(game: Game, player: Player) {
    if (game.players.length >= 6) {
      throw new Error("Maximum of 6 players is allowed");
    }

    this.addPerson(game, player, game.players);
  }

  private addPerson(game: Game, person: Person, persons: Person[]) {
    this.validatePersonNameUniqueness(game, person);

    if (!persons.includes(person)) {
      persons.push(person);
    }
    person.gameid = game.id;
  }

  private validatePersonNameUniqueness(game: Game, person: Person) {
    const people: Person[] = (<Person[]>[])
      .concat(game.players)
      .concat(game.spectators);

    for (let p of people) {
      if (p.name === person.name) {
        throw new DuplicateError(
          `Player name must be unique to the game. a player named "${person.name}" already exists`
        );
      }
    }
  }

  removePlayer(game: Game, player: Player) {
    this.removePerson(player, game.players);
  }

  private removePerson(person: Person, persons: Person[]) {
    const index = this.findPlayerIndex(person, persons);
    if (index > -1) {
      persons.splice(index, 1);
    }
    person.gameid = undefined;
  }

  private findPlayerIndex(person: Person, persons: Person[]): number {
    for (let i = 0; i < persons.length; i++) {
      if (isEqual(person, persons[i])) {
        return i;
      }
    }

    return -1;
  }

  removeAllPlayers(game: Game) {
    game.players = [];
  }

  addSpectator(game: Game, spectator: Spectator) {
    this.addPerson(game, spectator, game.spectators);
  }

  removeSpectator(game: Game, spectator: Spectator) {
    this.removePerson(spectator, game.spectators);
  }

  removeAllSpectators(game: Game) {
    game.spectators = [];
  }
}
