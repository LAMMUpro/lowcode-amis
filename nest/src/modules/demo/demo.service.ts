import { Injectable } from '@nestjs/common';

@Injectable()
export class DemoService {
  getHello(query: any): string {
    const queryStr = Object.keys(query).length ? `<div>query: ${JSON.stringify(query)}</div>` : '';
    if (process.env.DEPLOY_TIME) { /** 只有线上环境有DEPLOY_TIME */
      return `<div>welcome to nest api!</div> <div>api deploy on ${process.env.DEPLOY_TIME}</div> ${queryStr}`;
    } else {
      return `<div>welcome to nest api!</div> ${queryStr}`;
    }
  }
}
